'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { getSupabase } from '@/lib/supabase';
import type { Profile, Problem, Comment } from '@/lib/supabase';
import { Loader2, User, FileText, MessageSquare, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  const locale = useLocale();
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/signin?returnTo=/${locale}/dashboard`);
    }
  }, [authLoading, isAuthenticated, locale, router]);

  // Fetch user profile
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data);
          setDisplayName(data.display_name || '');
          setBio(data.bio || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch user's problems
  useEffect(() => {
    if (!user) return;

    const fetchProblems = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('problems')
          .select('*')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching problems:', error);
        } else {
          setProblems(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingProblems(false);
      }
    };

    fetchProblems();
  }, [user]);

  // Fetch user's comments
  useEffect(() => {
    if (!user) return;

    const fetchComments = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('comments')
          .select('*, problems(title)')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error fetching comments:', error);
        } else {
          setComments(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: displayName.trim() || null,
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        });

      if (error) {
        toast.error(locale === 'en' ? 'Failed to save profile' : 'प्रोफाइल सुरक्षित गर्न असफल');
        console.error('Error saving profile:', error);
      } else {
        toast.success(locale === 'en' ? 'Profile saved successfully' : 'प्रोफाइल सफलतापूर्वक सुरक्षित गरियो');
      }
    } catch (error) {
      toast.error(locale === 'en' ? 'An error occurred' : 'त्रुटि देखा पर्‍यो');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-nepal-crimson" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === 'en' ? 'Dashboard' : 'ड्यासबोर्ड'}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === 'en' ? 'Manage your profile and content' : 'आफ्नो प्रोफाइल र सामग्री व्यवस्थापन गर्नुहोस्'}
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Profile' : 'प्रोफाइल'}
            </TabsTrigger>
            <TabsTrigger value="problems">
              <FileText className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Problems' : 'समस्याहरू'}
              <Badge variant="secondary" className="ml-2">{problems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="discussions">
              <MessageSquare className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Discussions' : 'छलफलहरू'}
              <Badge variant="secondary" className="ml-2">{comments.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{locale === 'en' ? 'Edit Profile' : 'प्रोफाइल सम्पादन गर्नुहोस्'}</CardTitle>
                <CardDescription>
                  {locale === 'en'
                    ? 'Update your profile information and avatar'
                    : 'आफ्नो प्रोफाइल जानकारी र अवतार अपडेट गर्नुहोस्'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingProfile ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-nepal-crimson" />
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarUrl || user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-2xl">
                          {displayName?.[0] || user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Label htmlFor="avatar_url">
                          {locale === 'en' ? 'Avatar URL' : 'अवतार URL'}
                        </Label>
                        <Input
                          id="avatar_url"
                          type="url"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                    </div>

                    {/* Display Name */}
                    <div className="space-y-2">
                      <Label htmlFor="display_name">
                        {locale === 'en' ? 'Display Name' : 'प्रदर्शन नाम'}
                      </Label>
                      <Input
                        id="display_name"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder={locale === 'en' ? 'Your name' : 'तपाईंको नाम'}
                        maxLength={50}
                      />
                    </div>

                    {/* Email (read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {locale === 'en' ? 'Email' : 'इमेल'}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email || ''}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-sm text-gray-500">
                        {locale === 'en' ? 'Email cannot be changed' : 'इमेल परिवर्तन गर्न सकिँदैन'}
                      </p>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio">
                        {locale === 'en' ? 'Bio' : 'परिचय'}
                      </Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder={locale === 'en'
                          ? 'Tell us about yourself...'
                          : 'आफ्नो बारेमा बताउनुहोस्...'}
                        rows={4}
                        maxLength={500}
                      />
                      <p className="text-sm text-gray-500">
                        {bio.length}/500
                      </p>
                    </div>

                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {locale === 'en' ? 'Save Changes' : 'परिवर्तनहरू सुरक्षित गर्नुहोस्'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Problems Tab */}
          <TabsContent value="problems">
            <Card>
              <CardHeader>
                <CardTitle>{locale === 'en' ? 'Your Problems' : 'तपाईंका समस्याहरू'}</CardTitle>
                <CardDescription>
                  {locale === 'en'
                    ? 'Problems you have posted'
                    : 'तपाईंले पोस्ट गर्नुभएका समस्याहरू'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingProblems ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-nepal-crimson" />
                  </div>
                ) : problems.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {locale === 'en' ? 'No problems yet' : 'अहिलेसम्म कुनै समस्या छैन'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {locale === 'en'
                        ? 'Share your first problem with the community'
                        : 'समुदायसँग आफ्नो पहिलो समस्या साझा गर्नुहोस्'}
                    </p>
                    <Button asChild>
                      <a href={`/${locale}/submit`}>
                        {locale === 'en' ? 'Post a Problem' : 'समस्या पोस्ट गर्नुहोस्'}
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {problems.map((problem) => (
                      <Card key={problem.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                <a
                                  href={`/${locale}/problems/${problem.id}`}
                                  className="hover:text-nepal-crimson"
                                >
                                  {problem.title}
                                </a>
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant={
                                  problem.status === 'solved' ? 'default' :
                                  problem.status === 'in_progress' ? 'secondary' : 'outline'
                                }>
                                  {problem.status === 'solved' ? (locale === 'en' ? 'Solved' : 'हल भएको') :
                                   problem.status === 'in_progress' ? (locale === 'en' ? 'In Progress' : 'प्रगतिमा') :
                                   (locale === 'en' ? 'Open' : 'खुला')}
                                </Badge>
                                <Badge variant="outline">
                                  {problem.category === 'technical' ? (locale === 'en' ? 'Technical' : 'प्राविधिक') :
                                   problem.category === 'policy' ? (locale === 'en' ? 'Policy' : 'नीति') :
                                   (locale === 'en' ? 'Both' : 'दुवै')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 line-clamp-2">{problem.description}</p>
                          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                            <span>{new Date(problem.created_at).toLocaleDateString(locale)}</span>
                            <span>•</span>
                            <span>{locale === 'en' ? 'Score' : 'स्कोर'}: {problem.score}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions">
            <Card>
              <CardHeader>
                <CardTitle>{locale === 'en' ? 'Your Discussions' : 'तपाईंका छलफलहरू'}</CardTitle>
                <CardDescription>
                  {locale === 'en'
                    ? 'Comments and discussions you have participated in'
                    : 'तपाईंले भाग लिनुभएका टिप्पणी र छलफलहरू'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingComments ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-nepal-crimson" />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {locale === 'en' ? 'No discussions yet' : 'अहिलेसम्म कुनै छलफल छैन'}
                    </h3>
                    <p className="text-gray-600">
                      {locale === 'en'
                        ? 'Join conversations by commenting on problems'
                        : 'समस्याहरूमा टिप्पणी गरेर वार्तालापमा सामेल हुनुहोस्'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{comment.body}</p>
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                <Badge variant="outline" className="text-xs">
                                  {comment.tag === 'idea' ? (locale === 'en' ? 'Idea' : 'विचार') :
                                   comment.tag === 'question' ? (locale === 'en' ? 'Question' : 'प्रश्न') :
                                   comment.tag === 'resource' ? (locale === 'en' ? 'Resource' : 'स्रोत') :
                                   (locale === 'en' ? 'General' : 'सामान्य')}
                                </Badge>
                                <span>•</span>
                                <span>{new Date(comment.created_at).toLocaleDateString(locale)}</span>
                                <span>•</span>
                                <span>{locale === 'en' ? 'Score' : 'स्कोर'}: {comment.score}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
