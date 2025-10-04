'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { getSupabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { Problem } from '@/lib/supabase';

interface ProblemEditFormProps {
  problem: Problem;
  locale: string;
}

interface FormData {
  title: string;
  description: string;
  category: 'technical' | 'policy' | 'both';
  tags: string;
  status: 'open' | 'in_progress' | 'solved' | 'archived';
}

export function ProblemEditForm({ problem, locale }: ProblemEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: problem.title,
      description: problem.description,
      category: problem.category,
      tags: problem.tags?.join(', ') || '',
      status: problem.status,
    },
  });

  const category = watch('category');
  const status = watch('status');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('problems')
        .update({
          title: data.title.trim(),
          description: data.description.trim(),
          category: data.category,
          tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', problem.id);

      if (error) {
        console.error('Error updating problem:', error);
        toast.error(locale === 'en' ? 'Failed to update problem' : 'समस्या अपडेट गर्न असफल');
      } else {
        toast.success(locale === 'en' ? 'Problem updated successfully!' : 'समस्या सफलतापूर्वक अपडेट गरियो!');
        router.push(`/${locale}/problems/${problem.id}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(locale === 'en' ? 'An unexpected error occurred' : 'अप्रत्याशित त्रुटि देखा पर्‍यो');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              {locale === 'en' ? 'Problem Title' : 'समस्याको शीर्षक'} *
            </Label>
            <Input
              id="title"
              {...register('title', {
                required: locale === 'en' ? 'Title is required' : 'शीर्षक आवश्यक छ',
                minLength: {
                  value: 10,
                  message: locale === 'en' ? 'Title must be at least 10 characters' : 'शीर्षक कम्तिमा १० अक्षर हुनुपर्छ',
                },
              })}
              placeholder={locale === 'en' ? 'Brief, clear title for your problem' : 'तपाईंको समस्याको लागि संक्षिप्त, स्पष्ट शीर्षक'}
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              {locale === 'en' ? 'Problem Description' : 'समस्याको विवरण'} *
            </Label>
            <Textarea
              id="description"
              {...register('description', {
                required: locale === 'en' ? 'Description is required' : 'विवरण आवश्यक छ',
                minLength: {
                  value: 50,
                  message: locale === 'en' ? 'Description must be at least 50 characters' : 'विवरण कम्तिमा ५० अक्षर हुनुपर्छ',
                },
              })}
              rows={8}
              placeholder={
                locale === 'en'
                  ? 'Describe the problem in detail. Include what you\'ve tried, constraints, and what success looks like.'
                  : 'समस्यालाई विस्तृत रूपमा वर्णन गर्नुहोस्। तपाईंले के प्रयास गर्नुभएको छ, बाधाहरू, र सफलता कस्तो देखिन्छ समावेश गर्नुहोस्।'
              }
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                {locale === 'en' ? 'Category' : 'श्रेणी'} *
              </Label>
              <Select value={category} onValueChange={(value) => setValue('category', value as 'technical' | 'policy' | 'both')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">
                    {locale === 'en' ? 'Technical Solution' : 'प्राविधिक समाधान'}
                  </SelectItem>
                  <SelectItem value="policy">
                    {locale === 'en' ? 'Policy Change' : 'नीति परिवर्तन'}
                  </SelectItem>
                  <SelectItem value="both">
                    {locale === 'en' ? 'Both Technical & Policy' : 'प्राविधिक र नीति दुवै'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                {locale === 'en' ? 'Status' : 'स्थिति'} *
              </Label>
              <Select value={status} onValueChange={(value) => setValue('status', value as 'open' | 'in_progress' | 'solved' | 'archived')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">
                    {locale === 'en' ? 'Open' : 'खुला'}
                  </SelectItem>
                  <SelectItem value="in_progress">
                    {locale === 'en' ? 'In Progress' : 'प्रगतिमा'}
                  </SelectItem>
                  <SelectItem value="solved">
                    {locale === 'en' ? 'Solved' : 'समाधान भयो'}
                  </SelectItem>
                  <SelectItem value="archived">
                    {locale === 'en' ? 'Archived' : 'संग्रहीत'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">
              {locale === 'en' ? 'Tags' : 'ट्यागहरू'}
            </Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder={locale === 'en' ? 'solar, education, rural (comma-separated)' : 'सौर्य, शिक्षा, ग्रामीण (अल्पविराम विभाजित)'}
            />
            <p className="text-sm text-gray-500">
              {locale === 'en' ? 'Separate tags with commas' : 'ट्यागहरूलाई अल्पविरामले विभाजित गर्नुहोस्'}
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {locale === 'en' ? 'Update Problem' : 'समस्या अपडेट गर्नुहोस्'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${locale}/problems/${problem.id}`)}
            >
              {locale === 'en' ? 'Cancel' : 'रद्द गर्नुहोस्'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
