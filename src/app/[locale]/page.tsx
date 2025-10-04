import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, MessageSquare, Lightbulb, Mountain } from 'lucide-react';
import { getSupabase, isSupabaseConfigured, type Problem } from '@/lib/supabase';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  // Fetch recent problems
  let recentProblems: Problem[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error && data) {
        // Fetch profiles for each problem
        recentProblems = await Promise.all(
          data.map(async (problem) => {
            if (problem.author_id) {
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('display_name, avatar_url')
                  .eq('id', problem.author_id)
                  .single();
                return { ...problem, profiles: profile || null };
              } catch {
                return { ...problem, profiles: null };
              }
            }
            return problem;
          })
        );
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-himalaya to-white py-20 lg:py-32">
        {/* Subtle logo pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="flex items-center justify-center h-full">
            <div className="flex items-baseline">
              <span className="text-9xl font-bold text-nepal-crimson">उपाय</span>
              <span className="text-5xl font-semibold text-nepal-blue align-super">hub</span>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-nepal-blue mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href={`/${locale}/submit`}>
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                <Link href={`/${locale}/problems`}>
                  {t('hero.browseCta')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? 'How It Works' : 'यसो काम गर्छ'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {locale === 'en'
                ? 'Share real problems, collaborate on solutions, and learn from each attempt.'
                : 'वास्तविक समस्याहरू साझेदारी गर्नुहोस्, समाधानमा सहयोग गर्नुहोस्, र प्रत्येक प्रयासबाट सिक्नुहोस्।'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-nepal-crimson/10 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-nepal-crimson" />
                </div>
                <CardTitle>
                  {locale === 'en' ? 'Share Problems' : 'समस्या साझेदारी गर्नुहोस्'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {locale === 'en'
                    ? 'Post real challenges you face in your community with photos, constraints, and details.'
                    : 'आफ्नो समुदायमा सामना गर्ने वास्तविक चुनौतीहरू फोटो, बाधाहरू र विवरणसहित पोस्ट गर्नुहोस्।'
                  }
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-nepal-green/10 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-nepal-green" />
                </div>
                <CardTitle>
                  {locale === 'en' ? 'Discuss Ideas' : 'विचारहरू छलफल गर्नुहोस्'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {locale === 'en'
                    ? 'Engage in thoughtful discussions, share resources, and brainstorm solutions together.'
                    : 'विचारशील छलफलमा संलग्न हुनुहोस्, स्रोतहरू साझेदारी गर्नुहोस्, र सँगै समाधानहरू खोज्नुहोस्।'
                  }
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-nepal-saffron/10 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                  <Lightbulb className="h-8 w-8 text-nepal-saffron" />
                </div>
                <CardTitle>
                  {locale === 'en' ? 'Share Attempts' : 'प्रयासहरू साझेदारी गर्नुहोस्'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {locale === 'en'
                    ? 'Document your solution attempts—successful or failed—so others can learn and build upon them.'
                    : 'आफ्ना समाधान प्रयासहरू दस्तावेज बनाउनुहोस्—सफल वा असफल—ताकि अरूले सिक्न र निर्माण गर्न सकून्।'
                  }
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Problems Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? 'Recent Problems' : 'हालका समस्याहरू'}
            </h2>
            <p className="text-xl text-gray-600">
              {locale === 'en'
                ? 'See what the community is working on'
                : 'समुदायले के मा काम गरिरहेको छ हेर्नुहोस्'
              }
            </p>
          </div>

          {/* Recent problem cards */}
          {recentProblems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recentProblems.map((problem) => (
                <Link key={problem.id} href={`/${locale}/problems/${problem.id}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary">
                          {t(`categories.${problem.category}`)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            problem.status === 'solved' ? 'text-green-600 border-green-600' :
                            problem.status === 'in_progress' ? 'text-blue-600 border-blue-600' :
                            'text-gray-600 border-gray-600'
                          }`}
                        >
                          {t(`statuses.${problem.status}`)}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2">
                        {problem.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 mb-4">
                        {problem.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{problem.profiles?.display_name || (locale === 'en' ? 'Anonymous' : 'अज्ञात')}</span>
                        <span>↑ {problem.score}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 mb-8">
              <p className="text-gray-600 mb-4">
                {locale === 'en'
                  ? 'No problems posted yet. Be the first to share a problem!'
                  : 'अझै कुनै समस्या पोस्ट गरिएको छैन। समस्या साझेदारी गर्ने पहिलो बन्नुहोस्!'}
              </p>
              <Button asChild>
                <Link href={`/${locale}/submit`}>
                  {locale === 'en' ? 'Post First Problem' : 'पहिलो समस्या पोस्ट गर्नुहोस्'}
                </Link>
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href={`/${locale}/problems`}>
                {locale === 'en' ? 'View All Problems' : 'सबै समस्याहरू हेर्नुहोस्'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-nepal-blue text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {locale === 'en'
              ? 'Ready to make a difference?'
              : 'परिवर्तन ल्याउन तयार हुनुहुन्छ?'
            }
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {locale === 'en'
              ? 'Join thousands of Nepali problem-solvers working together to build better communities.'
              : 'राम्रो समुदायहरू निर्माण गर्न सँगै काम गरिरहेका हजारौं नेपाली समस्या समाधानकर्ताहरूसँग जोडिनुहोस्।'
            }
          </p>
          <Button asChild size="lg" className="bg-white text-nepal-blue hover:bg-gray-100">
            <Link href={`/${locale}/submit`}>
              {locale === 'en' ? 'Post Your First Problem' : 'आफ्नो पहिलो समस्या पोस्ट गर्नुहोस्'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}