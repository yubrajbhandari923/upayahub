'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

interface FeedbackFormData {
  name: string;
  email: string;
  feedbackType: 'bug' | 'feature' | 'improvement' | 'other';
  message: string;
}

interface FeedbackFormProps {
  locale: string;
}

export function FeedbackForm({ locale }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    defaultValues: {
      name: user?.user_metadata?.display_name || '',
      email: user?.email || '',
      feedbackType: 'improvement',
      message: '',
    },
  });

  const feedbackType = watch('feedbackType');

  const onSubmit = async (data: FeedbackFormData) => {
    if (!isSupabaseConfigured()) {
      toast.error(locale === 'en' ? 'Service not configured' : 'सेवा कन्फिगर गरिएको छैन');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('feedback').insert({
        user_id: user?.id || null,
        name: data.name,
        email: data.email,
        feedback_type: data.feedbackType,
        message: data.message,
      });

      if (error) {
        console.error('Error submitting feedback:', error);
        toast.error(locale === 'en' ? 'Failed to submit feedback' : 'प्रतिक्रिया पेश गर्न असफल');
      } else {
        toast.success(
          locale === 'en'
            ? 'Thank you for your feedback!'
            : 'तपाईंको प्रतिक्रियाको लागि धन्यवाद!'
        );
        reset();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error(locale === 'en' ? 'An unexpected error occurred' : 'अप्रत्याशित त्रुटि देखा पर्‍यो');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {locale === 'en' ? 'Share Your Feedback' : 'आफ्नो प्रतिक्रिया साझेदारी गर्नुहोस्'}
        </CardTitle>
        <CardDescription>
          {locale === 'en'
            ? 'Help us improve the platform by sharing your thoughts, reporting bugs, or suggesting new features.'
            : 'आफ्ना विचारहरू साझेदारी गरेर, बगहरू रिपोर्ट गरेर, वा नयाँ सुविधाहरू सुझाव दिएर प्लेटफर्म सुधार गर्न मद्दत गर्नुहोस्।'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {locale === 'en' ? 'Name' : 'नाम'} *
              </Label>
              <Input
                id="name"
                {...register('name', {
                  required: locale === 'en' ? 'Name is required' : 'नाम आवश्यक छ',
                })}
                placeholder={locale === 'en' ? 'Your name' : 'तपाईंको नाम'}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                {locale === 'en' ? 'Email' : 'इमेल'} *
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: locale === 'en' ? 'Email is required' : 'इमेल आवश्यक छ',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: locale === 'en' ? 'Invalid email address' : 'अवैध इमेल ठेगाना',
                  },
                })}
                placeholder={locale === 'en' ? 'your@email.com' : 'तपाईंको@इमेल.com'}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Feedback Type */}
          <div className="space-y-2">
            <Label htmlFor="feedbackType">
              {locale === 'en' ? 'Feedback Type' : 'प्रतिक्रिया प्रकार'} *
            </Label>
            <Select
              value={feedbackType}
              onValueChange={(value) => setValue('feedbackType', value as 'bug' | 'feature' | 'improvement' | 'other')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">
                  {locale === 'en' ? 'Bug Report' : 'बग रिपोर्ट'}
                </SelectItem>
                <SelectItem value="feature">
                  {locale === 'en' ? 'Feature Request' : 'सुविधा अनुरोध'}
                </SelectItem>
                <SelectItem value="improvement">
                  {locale === 'en' ? 'Improvement Suggestion' : 'सुधार सुझाव'}
                </SelectItem>
                <SelectItem value="other">
                  {locale === 'en' ? 'Other' : 'अन्य'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">
              {locale === 'en' ? 'Message' : 'सन्देश'} *
            </Label>
            <Textarea
              id="message"
              {...register('message', {
                required: locale === 'en' ? 'Message is required' : 'सन्देश आवश्यक छ',
                minLength: {
                  value: 10,
                  message:
                    locale === 'en'
                      ? 'Message must be at least 10 characters'
                      : 'सन्देश कम्तिमा १० अक्षर हुनुपर्छ',
                },
              })}
              rows={6}
              placeholder={
                locale === 'en'
                  ? 'Tell us what you think...'
                  : 'हामीलाई तपाईं के सोच्नुहुन्छ भन्नुहोस्...'
              }
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {locale === 'en' ? 'Submitting...' : 'पेश गर्दै...'}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {locale === 'en' ? 'Submit Feedback' : 'प्रतिक्रिया पेश गर्नुहोस्'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
