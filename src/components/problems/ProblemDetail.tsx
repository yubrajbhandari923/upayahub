'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share2,
  Flag,
  Calendar,
  MapPin,
  User,
  Lightbulb,
  Plus,
  Loader2,
  Send
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import type { Problem, Comment, Attempt } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProblemDetailProps {
  problem: Problem;
}

export function ProblemDetail({ problem: initialProblem }: ProblemDetailProps) {
  const [problem, setProblem] = useState<Problem>(initialProblem);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showAttemptForm, setShowAttemptForm] = useState(false);
  const [commentBody, setCommentBody] = useState('');
  const [commentTag, setCommentTag] = useState<'idea' | 'question' | 'resource' | 'general'>('general');
  const [attemptData, setAttemptData] = useState({
    title: '',
    summary: '',
    status: 'working' as 'working' | 'partial' | 'failed',
    lessons: '',
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingAttempt, setSubmittingAttempt] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingAttempts, setLoadingAttempts] = useState(true);

  const locale = useLocale();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [problem.id]);

  // Fetch attempts
  useEffect(() => {
    fetchAttempts();
  }, [problem.id]);

  // Fetch user's vote
  useEffect(() => {
    if (user) {
      fetchUserVote();
    }
  }, [user, problem.id]);

  const fetchComments = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('problem_id', problem.id)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        // Fetch profiles for each comment
        const commentsWithProfiles = await Promise.all(
          (data || []).map(async (comment) => {
            if (comment.author_id) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('display_name, avatar_url')
                .eq('id', comment.author_id)
                .single();
              return { ...comment, profiles: profile };
            }
            return comment;
          })
        );
        setComments(commentsWithProfiles);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('attempts')
        .select('*')
        .eq('problem_id', problem.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching attempts:', error);
      } else {
        // Fetch profiles for each attempt
        const attemptsWithProfiles = await Promise.all(
          (data || []).map(async (attempt) => {
            if (attempt.author_id) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('display_name, avatar_url')
                .eq('id', attempt.author_id)
                .single();
              return { ...attempt, profiles: profile };
            }
            return attempt;
          })
        );
        setAttempts(attemptsWithProfiles);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingAttempts(false);
    }
  };

  const fetchUserVote = async () => {
    if (!user) return;

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('problem_votes')
        .select('value')
        .eq('problem_id', problem.id)
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setUserVote(data.value);
      }
    } catch (error) {
      // No vote found, which is fine
    }
  };

  const handleVote = async (value: 1 | -1) => {
    if (!isAuthenticated || !user) {
      toast.error(locale === 'en' ? 'Please sign in to vote' : 'भोट गर्न कृपया साइन इन गर्नुहोस्');
      return;
    }

    try {
      const supabase = getSupabase();

      // If clicking the same vote, remove it
      if (userVote === value) {
        await supabase
          .from('problem_votes')
          .delete()
          .eq('problem_id', problem.id)
          .eq('user_id', user.id);

        setProblem({ ...problem, score: problem.score - value });
        setUserVote(null);
      } else {
        // Upsert the vote
        await supabase
          .from('problem_votes')
          .upsert({
            problem_id: problem.id,
            user_id: user.id,
            value
          });

        const scoreDiff = userVote === null ? value : value - userVote;
        setProblem({ ...problem, score: problem.score + scoreDiff });
        setUserVote(value);
      }

      // Update the problem score
      await supabase
        .from('problems')
        .update({ score: problem.score + (userVote === value ? -value : (userVote === null ? value : value - userVote)) })
        .eq('id', problem.id);

    } catch (error) {
      console.error('Error voting:', error);
      toast.error(locale === 'en' ? 'Failed to vote' : 'भोट गर्न असफल');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error(locale === 'en' ? 'Please sign in to comment' : 'टिप्पणी गर्न कृपया साइन इन गर्नुहोस्');
      router.push(`/${locale}/signin?returnTo=/${locale}/problems/${problem.id}`);
      return;
    }

    if (!commentBody.trim()) {
      toast.error(locale === 'en' ? 'Comment cannot be empty' : 'टिप्पणी खाली हुन सक्दैन');
      return;
    }

    setSubmittingComment(true);

    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('comments')
        .insert({
          problem_id: problem.id,
          author_id: user.id,
          body: commentBody.trim(),
          tag: commentTag,
          score: 0
        });

      if (error) {
        toast.error(locale === 'en' ? 'Failed to post comment' : 'टिप्पणी पोस्ट गर्न असफल');
        console.error('Error posting comment:', error);
      } else {
        toast.success(locale === 'en' ? 'Comment posted!' : 'टिप्पणी पोस्ट गरियो!');
        setCommentBody('');
        setCommentTag('general');
        setShowCommentForm(false);
        fetchComments();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(locale === 'en' ? 'An error occurred' : 'त्रुटि देखा पर्‍यो');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmitAttempt = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error(locale === 'en' ? 'Please sign in to share an attempt' : 'प्रयास साझेदारी गर्न कृपया साइन इन गर्नुहोस्');
      router.push(`/${locale}/signin?returnTo=/${locale}/problems/${problem.id}`);
      return;
    }

    if (!attemptData.title.trim() || !attemptData.summary.trim() || !attemptData.lessons.trim()) {
      toast.error(locale === 'en' ? 'Please fill all required fields' : 'कृपया सबै आवश्यक क्षेत्रहरू भर्नुहोस्');
      return;
    }

    setSubmittingAttempt(true);

    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('attempts')
        .insert({
          problem_id: problem.id,
          author_id: user.id,
          title: attemptData.title.trim(),
          summary: attemptData.summary.trim(),
          status: attemptData.status,
          lessons: attemptData.lessons.trim(),
          links: [],
          media: []
        });

      if (error) {
        toast.error(locale === 'en' ? 'Failed to share attempt' : 'प्रयास साझेदारी गर्न असफल');
        console.error('Error sharing attempt:', error);
      } else {
        toast.success(locale === 'en' ? 'Attempt shared!' : 'प्रयास साझेदारी गरियो!');
        setAttemptData({
          title: '',
          summary: '',
          status: 'working',
          lessons: ''
        });
        setShowAttemptForm(false);
        fetchAttempts();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(locale === 'en' ? 'An error occurred' : 'त्रुटि देखा पर्‍यो');
    } finally {
      setSubmittingAttempt(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: problem.title,
        text: problem.description.substring(0, 200) + '...',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(locale === 'en' ? 'Link copied to clipboard!' : 'लिङ्क क्लिपबोर्डमा प्रतिलिपि गरियो!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'ne-NP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'solved': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    if (locale === 'en') {
      switch (status) {
        case 'open': return 'Open';
        case 'in_progress': return 'In Progress';
        case 'solved': return 'Solved';
        case 'archived': return 'Archived';
        default: return status;
      }
    } else {
      switch (status) {
        case 'open': return 'खुला';
        case 'in_progress': return 'प्रगतिमा';
        case 'solved': return 'समाधान भयो';
        case 'archived': return 'संग्रहीत';
        default: return status;
      }
    }
  };

  const getCategoryText = (category: string) => {
    if (locale === 'en') {
      switch (category) {
        case 'technical': return 'Technical Solution';
        case 'policy': return 'Policy Change';
        case 'both': return 'Technical & Policy';
        default: return category;
      }
    } else {
      switch (category) {
        case 'technical': return 'प्राविधिक समाधान';
        case 'policy': return 'नीति परिवर्तन';
        case 'both': return 'प्राविधिक र नीति';
        default: return category;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Problem Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getStatusColor(problem.status)}>
                        {getStatusText(problem.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getCategoryText(problem.category)}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl lg:text-3xl mb-3">
                      {problem.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{problem.profiles?.display_name || (locale === 'en' ? 'Anonymous' : 'अज्ञात')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(problem.created_at)}</span>
                      </div>
                      {problem.location?.province && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {problem.location.district && `${problem.location.district}, `}
                            {locale === 'en'
                              ? problem.location.province.charAt(0).toUpperCase() + problem.location.province.slice(1)
                              : problem.location.province
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {problem.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                {problem.tags && problem.tags.length > 0 && (
                  <div className="mt-6">
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media */}
                {problem.media && problem.media.length > 0 && (
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {problem.media.map((media: any, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                          {media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt={`Problem image ${index + 1}`}
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <video
                              src={media.url}
                              controls
                              className="w-full h-48 object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {locale === 'en' ? 'Discussion' : 'छलफल'} ({comments.length})
                  </span>
                  {!showCommentForm && (
                    <Button size="sm" onClick={() => setShowCommentForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {locale === 'en' ? 'Add Comment' : 'टिप्पणी थप्नुहोस्'}
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  {locale === 'en'
                    ? 'Share your ideas, ask questions, or provide resources'
                    : 'आफ्ना विचारहरू साझेदारी गर्नुहोस्, प्रश्नहरू सोध्नुहोस्, वा स्रोतहरू प्रदान गर्नुहोस्'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Comment Form */}
                {showCommentForm && (
                  <form onSubmit={handleSubmitComment} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="comment-tag">{locale === 'en' ? 'Comment Type' : 'टिप्पणी प्रकार'}</Label>
                        <Select value={commentTag} onValueChange={(value: any) => setCommentTag(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">{locale === 'en' ? 'General' : 'सामान्य'}</SelectItem>
                            <SelectItem value="idea">{locale === 'en' ? 'Idea' : 'विचार'}</SelectItem>
                            <SelectItem value="question">{locale === 'en' ? 'Question' : 'प्रश्न'}</SelectItem>
                            <SelectItem value="resource">{locale === 'en' ? 'Resource' : 'स्रोत'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="comment-body">{locale === 'en' ? 'Your Comment' : 'तपाईंको टिप्पणी'}</Label>
                        <Textarea
                          id="comment-body"
                          value={commentBody}
                          onChange={(e) => setCommentBody(e.target.value)}
                          placeholder={locale === 'en' ? 'Share your thoughts...' : 'आफ्ना विचारहरू साझेदारी गर्नुहोस्...'}
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={submittingComment}>
                          {submittingComment && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          <Send className="h-4 w-4 mr-2" />
                          {locale === 'en' ? 'Post Comment' : 'टिप्पणी पोस्ट गर्नुहोस्'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowCommentForm(false)}>
                          {locale === 'en' ? 'Cancel' : 'रद्द गर्नुहोस्'}
                        </Button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Comments List */}
                {loadingComments ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-nepal-crimson" />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">
                      {locale === 'en' ? 'No comments yet' : 'अहिलेसम्म कुनै टिप्पणी छैन'}
                    </p>
                    <p className="text-sm">
                      {locale === 'en'
                        ? 'Be the first to share your thoughts!'
                        : 'आफ्ना विचारहरू साझेदारी गर्ने पहिलो व्यक्ति बन्नुहोस्!'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.profiles?.avatar_url} />
                            <AvatarFallback>
                              {comment.profiles?.display_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {comment.profiles?.display_name || (locale === 'en' ? 'Anonymous' : 'अज्ञात')}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {comment.tag === 'idea' ? (locale === 'en' ? 'Idea' : 'विचार') :
                                 comment.tag === 'question' ? (locale === 'en' ? 'Question' : 'प्रश्न') :
                                 comment.tag === 'resource' ? (locale === 'en' ? 'Resource' : 'स्रोत') :
                                 (locale === 'en' ? 'General' : 'सामान्य')}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Solution Attempts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    {locale === 'en' ? 'Solution Attempts' : 'समाधान प्रयासहरू'} ({attempts.length})
                  </span>
                  {!showAttemptForm && (
                    <Button size="sm" onClick={() => setShowAttemptForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {locale === 'en' ? 'Share Attempt' : 'प्रयास साझेदारी गर्नुहोस्'}
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  {locale === 'en'
                    ? 'Real attempts to solve this problem, including failures'
                    : 'यो समस्या समाधान गर्ने वास्तविक प्रयासहरू, असफलताहरू सहित'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Attempt Form */}
                {showAttemptForm && (
                  <form onSubmit={handleSubmitAttempt} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="attempt-title">{locale === 'en' ? 'Title' : 'शीर्षक'} *</Label>
                        <input
                          id="attempt-title"
                          type="text"
                          className="w-full px-3 py-2 border rounded-md"
                          value={attemptData.title}
                          onChange={(e) => setAttemptData({ ...attemptData, title: e.target.value })}
                          placeholder={locale === 'en' ? 'Brief title for your attempt' : 'तपाईंको प्रयासको लागि संक्षिप्त शीर्षक'}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="attempt-status">{locale === 'en' ? 'Status' : 'स्थिति'} *</Label>
                        <Select value={attemptData.status} onValueChange={(value: any) => setAttemptData({ ...attemptData, status: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="working">{locale === 'en' ? 'Working' : 'काम गरिरहेको'}</SelectItem>
                            <SelectItem value="partial">{locale === 'en' ? 'Partial Success' : 'आंशिक सफलता'}</SelectItem>
                            <SelectItem value="failed">{locale === 'en' ? 'Failed' : 'असफल'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="attempt-summary">{locale === 'en' ? 'Summary' : 'सारांश'} *</Label>
                        <Textarea
                          id="attempt-summary"
                          value={attemptData.summary}
                          onChange={(e) => setAttemptData({ ...attemptData, summary: e.target.value })}
                          placeholder={locale === 'en' ? 'What did you try?' : 'तपाईंले के प्रयास गर्नुभयो?'}
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="attempt-lessons">{locale === 'en' ? 'Lessons Learned' : 'सिकेका कुराहरू'} *</Label>
                        <Textarea
                          id="attempt-lessons"
                          value={attemptData.lessons}
                          onChange={(e) => setAttemptData({ ...attemptData, lessons: e.target.value })}
                          placeholder={locale === 'en' ? 'What did you learn?' : 'तपाईंले के सिक्नुभयो?'}
                          rows={3}
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={submittingAttempt}>
                          {submittingAttempt && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          <Send className="h-4 w-4 mr-2" />
                          {locale === 'en' ? 'Share Attempt' : 'प्रयास साझेदारी गर्नुहोस्'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowAttemptForm(false)}>
                          {locale === 'en' ? 'Cancel' : 'रद्द गर्नुहोस्'}
                        </Button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Attempts List */}
                {loadingAttempts ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-nepal-crimson" />
                  </div>
                ) : attempts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">
                      {locale === 'en' ? 'No solution attempts yet' : 'अहिलेसम्म कुनै समाधान प्रयास छैन'}
                    </p>
                    <p className="text-sm">
                      {locale === 'en'
                        ? 'Share your attempt to solve this problem!'
                        : 'यो समस्या समाधान गर्ने आफ्नो प्रयास साझेदारी गर्नुहोस्!'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attempts.map((attempt) => (
                      <Card key={attempt.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={
                                  attempt.status === 'working' ? 'default' :
                                  attempt.status === 'partial' ? 'secondary' :
                                  'outline'
                                }>
                                  {attempt.status === 'working' ? (locale === 'en' ? 'Working' : 'काम गरिरहेको') :
                                   attempt.status === 'partial' ? (locale === 'en' ? 'Partial' : 'आंशिक') :
                                   (locale === 'en' ? 'Failed' : 'असफल')}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg">{attempt.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={attempt.profiles?.avatar_url} />
                                  <AvatarFallback>
                                    {attempt.profiles?.display_name?.[0] || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{attempt.profiles?.display_name || (locale === 'en' ? 'Anonymous' : 'अज्ञात')}</span>
                                <span>•</span>
                                <span>{formatDate(attempt.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm mb-1">{locale === 'en' ? 'Summary' : 'सारांश'}</h4>
                              <p className="text-sm text-gray-700">{attempt.summary}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-1">{locale === 'en' ? 'Lessons Learned' : 'सिकेका कुराहरू'}</h4>
                              <p className="text-sm text-gray-700">{attempt.lessons}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voting */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${userVote === 1 ? 'text-nepal-crimson' : ''}`}
                    onClick={() => handleVote(1)}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                  <span className="text-lg font-semibold">{problem.score}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${userVote === -1 ? 'text-nepal-blue' : ''}`}
                    onClick={() => handleVote(-1)}
                  >
                    <ArrowDown className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            {problem.profiles && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {locale === 'en' ? 'Posted By' : 'द्वारा पोस्ट गरिएको'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={problem.profiles.avatar_url} />
                      <AvatarFallback>
                        {problem.profiles.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{problem.profiles.display_name}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {problem.profiles.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Problem Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === 'en' ? 'Problem Stats' : 'समस्या तथ्याङ्क'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {locale === 'en' ? 'Comments' : 'टिप्पणीहरू'}
                  </span>
                  <span className="font-medium">{comments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {locale === 'en' ? 'Attempts' : 'प्रयासहरू'}
                  </span>
                  <span className="font-medium">{attempts.length}</span>
                </div>
                <div className="border-t" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {locale === 'en' ? 'Created' : 'सिर्जना गरिएको'}
                  </span>
                  <span className="text-sm">{formatDate(problem.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
