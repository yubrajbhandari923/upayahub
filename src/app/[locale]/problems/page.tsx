'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Problem } from '@/lib/supabase';
import { Search, Filter, Plus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 12;

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  // Fetch problems from Supabase
  useEffect(() => {
    const fetchProblems = async () => {
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured');
        setLoading(false);
        return;
      }

      try {
        const supabase = getSupabase();
        console.log('Fetching problems from Supabase...');

        const { data, error } = await supabase
          .from('problems')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching problems:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          toast.error(locale === 'en' ? 'Failed to load problems' : 'समस्याहरू लोड गर्न असफल');
          setProblems([]);
          setFilteredProblems([]);
        } else {
          console.log(`Fetched ${data?.length || 0} problems`);

          if (!data || data.length === 0) {
            setProblems([]);
            setFilteredProblems([]);
          } else {
            // Fetch profiles separately for each problem to avoid join issues
            const problemsWithProfiles = await Promise.all(
              data.map(async (problem) => {
                if (problem.author_id) {
                  try {
                    const { data: profile } = await supabase
                      .from('profiles')
                      .select('display_name, avatar_url')
                      .eq('id', problem.author_id)
                      .single();

                    return { ...problem, profiles: profile || null };
                  } catch (profileError) {
                    console.error('Error fetching profile for problem:', problem.id, profileError);
                    return { ...problem, profiles: null };
                  }
                }
                return problem;
              })
            );

            setProblems(problemsWithProfiles);
            setFilteredProblems(problemsWithProfiles);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error(locale === 'en' ? 'An unexpected error occurred' : 'अप्रत्याशित त्रुटि देखा पर्‍यो');
        setProblems([]);
        setFilteredProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [locale]);

  // Filter and sort problems
  useEffect(() => {
    let filtered = [...problems];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Location filter
    if (locationFilter.trim()) {
      const locationQuery = locationFilter.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.location?.country?.toLowerCase().includes(locationQuery) ||
          p.location?.province?.toLowerCase().includes(locationQuery) ||
          p.location?.district?.toLowerCase().includes(locationQuery) ||
          p.location?.municipality?.toLowerCase().includes(locationQuery)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'top':
        filtered.sort((a, b) => b.score - a.score);
        break;
      case 'discussed':
        // For now, sort by score as a proxy. In a real app, you'd count comments
        filtered.sort((a, b) => b.score - a.score);
        break;
    }

    setFilteredProblems(filtered);
    setDisplayCount(ITEMS_PER_PAGE); // Reset pagination when filters change
  }, [problems, searchQuery, categoryFilter, statusFilter, locationFilter, sortBy]);

  const handleProblemClick = (problemId: string) => {
    router.push(`/${locale}/problems/${problemId}`);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const displayedProblems = filteredProblems.slice(0, displayCount);
  const hasMore = displayCount < filteredProblems.length;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return locale === 'en' ? 'Just now' : 'अहिले';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return locale === 'en' ? `${minutes}m ago` : `${minutes} मिनेट अघि`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return locale === 'en' ? `${hours}h ago` : `${hours} घण्टा अघि`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return locale === 'en' ? `${days}d ago` : `${days} दिन अघि`;
    } else {
      return date.toLocaleDateString(locale);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('problems.title')}
            </h1>
            <p className="text-gray-600">
              {locale === 'en'
                ? 'Discover problems shared by the community and join the discussion.'
                : 'समुदायले साझेदारी गरेका समस्याहरू पत्ता लगाउनुहोस् र छलफलमा भाग लिनुहोस्।'
              }
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link href={`/${locale}/submit`}>
              <Plus className="h-4 w-4 mr-2" />
              {t('navigation.submit')}
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('problems.search')}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('problems.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {locale === 'en' ? 'All Categories' : 'सबै श्रेणीहरू'}
                </SelectItem>
                <SelectItem value="technical">{t('categories.technical')}</SelectItem>
                <SelectItem value="policy">{t('categories.policy')}</SelectItem>
                <SelectItem value="both">{t('categories.both')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('problems.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {locale === 'en' ? 'All Status' : 'सबै स्थिति'}
                </SelectItem>
                <SelectItem value="open">{t('statuses.open')}</SelectItem>
                <SelectItem value="in_progress">{t('statuses.in_progress')}</SelectItem>
                <SelectItem value="solved">{t('statuses.solved')}</SelectItem>
                <SelectItem value="archived">{t('statuses.archived')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <div>
              <Input
                placeholder={t('problems.location')}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder={t('problems.sort')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('problems.newest')}</SelectItem>
                <SelectItem value="oldest">{locale === 'en' ? 'Oldest' : 'पुरानो'}</SelectItem>
                <SelectItem value="top">{t('problems.top')}</SelectItem>
                <SelectItem value="discussed">{t('problems.mostDiscussed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Summary */}
          {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' || locationFilter) && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">
                  {locale === 'en' ? 'Active filters:' : 'सक्रिय फिल्टरहरू:'}
                </span>
                {searchQuery && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery('')}>
                    {locale === 'en' ? 'Search' : 'खोज'}: {searchQuery} ×
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setCategoryFilter('all')}>
                    {t(`categories.${categoryFilter}`)} ×
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setStatusFilter('all')}>
                    {t(`statuses.${statusFilter}`)} ×
                  </Badge>
                )}
                {locationFilter && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setLocationFilter('')}>
                    {locale === 'en' ? 'Location' : 'स्थान'}: {locationFilter} ×
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setStatusFilter('all');
                    setLocationFilter('');
                  }}
                >
                  {locale === 'en' ? 'Clear all' : 'सबै हटाउनुहोस्'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          {loading ? (
            <span>{locale === 'en' ? 'Loading...' : 'लोड हुँदै...'}</span>
          ) : (
            <span>
              {locale === 'en'
                ? `Showing ${displayedProblems.length} of ${filteredProblems.length} problems`
                : `${filteredProblems.length} मध्ये ${displayedProblems.length} समस्याहरू देखाउँदै`}
            </span>
          )}
        </div>

        {/* Problems Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-nepal-crimson" />
          </div>
        ) : !isSupabaseConfigured() ? (
          <div className="text-center py-20">
            <AlertCircle className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {locale === 'en' ? 'Database not configured' : 'डाटाबेस कन्फिगर गरिएको छैन'}
            </h3>
            <p className="text-gray-600">
              {locale === 'en'
                ? 'Please configure your Supabase environment variables to view problems.'
                : 'समस्याहरू हेर्न कृपया आफ्नो Supabase वातावरण चरहरू कन्फिगर गर्नुहोस्।'}
            </p>
          </div>
        ) : displayedProblems.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('problems.noResults')}
            </h3>
            <p className="text-gray-600 mb-4">
              {locale === 'en'
                ? 'Try adjusting your filters or search query.'
                : 'आफ्नो फिल्टर वा खोज प्रश्न समायोजन गर्ने प्रयास गर्नुहोस्।'}
            </p>
            {problems.length === 0 && (
              <Button asChild>
                <Link href={`/${locale}/submit`}>
                  {locale === 'en' ? 'Be the first to post a problem' : 'समस्या पोस्ट गर्ने पहिलो बन्नुहोस्'}
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProblems.map((problem) => (
                <Card
                  key={problem.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleProblemClick(problem.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant={
                          problem.category === 'technical'
                            ? 'default'
                            : problem.category === 'policy'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {t(`categories.${problem.category}`)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          problem.status === 'solved'
                            ? 'text-green-600 border-green-600'
                            : problem.status === 'in_progress'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-600 border-gray-600'
                        }
                      >
                        {t(`statuses.${problem.status}`)}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">{problem.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">
                      {problem.description}
                    </CardDescription>

                    {/* Tags */}
                    {problem.tags && problem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {problem.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {problem.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{problem.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Location */}
                    {problem.location && (
                      <div className="text-xs text-gray-500 mb-2">
                        📍 {problem.location.district || problem.location.province || problem.location.country}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span>{problem.profiles?.display_name || locale === 'en' ? 'Anonymous' : 'अज्ञात'}</span>
                      <span>{formatTimeAgo(problem.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-nepal-crimson font-medium">
                        ↑ {problem.score} {locale === 'en' ? 'votes' : 'भोट'}
                      </span>
                      {problem.location && (
                        <span className="text-gray-500">
                          {problem.location.district || locale === 'en' ? 'No location' : 'स्थान छैन'}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" onClick={handleLoadMore}>
                  {locale === 'en' ? 'Load More Problems' : 'थप समस्याहरू लोड गर्नुहोस्'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
