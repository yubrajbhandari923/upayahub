'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, AlertCircle, Lightbulb, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

interface ProblemFormData {
  title: string;
  description: string;
  category: 'technical' | 'policy' | 'both' | '';
  tags: string[];
  location: {
    province: string;
    district: string;
  };
  media: File[];
}

export function ProblemSubmissionForm() {
  const { user, isAuthenticated, isConfigured } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProblemFormData>({
    title: '',
    description: '',
    category: '',
    tags: [],
    location: {
      province: '',
      district: ''
    },
    media: []
  });

  const handleInputChange = (field: keyof ProblemFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (field: 'province' | 'district', value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleMediaUpload = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        toast.error(locale === 'en' ? 'Only images and videos are allowed' : 'केवल छविहरू र भिडिओहरू मात्र अनुमति छ');
        return false;
      }

      if (!isValidSize) {
        toast.error(locale === 'en' ? 'File size must be less than 10MB' : 'फाइल आकार १० एमबी भन्दा कम हुनुपर्छ');
        return false;
      }

      return true;
    });

    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...validFiles]
    }));
  };

  const uploadMedia = async (files: File[]): Promise<string[]> => {
    if (!isConfigured || files.length === 0) return [];

    const supabase = getSupabase();

    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `problems/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      return {
        type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
        url: data.publicUrl,
        thumb_url: file.type.startsWith('image/') ? data.publicUrl : undefined
      };
    });

    try {
      const mediaObjects = await Promise.all(uploadPromises);
      return mediaObjects;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error(locale === 'en' ? 'You must be signed in to submit a problem' : 'समस्या पेश गर्न तपाईंले साइन इन गर्नुपर्छ');
      return;
    }

    if (!isConfigured) {
      toast.error(locale === 'en' ? 'Database not configured' : 'डाटाबेस कन्फिगर गरिएको छैन');
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      toast.error(locale === 'en' ? 'Title is required' : 'शीर्षक आवश्यक छ');
      return;
    }

    if (!formData.description.trim()) {
      toast.error(locale === 'en' ? 'Description is required' : 'विवरण आवश्यक छ');
      return;
    }

    if (!formData.category) {
      toast.error(locale === 'en' ? 'Category is required' : 'श्रेणी आवश्यक छ');
      return;
    }

    setLoading(true);

    try {
      // Upload media files
      let mediaData: any[] = [];
      if (formData.media.length > 0) {
        mediaData = await uploadMedia(formData.media);
      }

      // Create problem record
      const problemData = {
        author_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        tags: formData.tags,
        language: locale as 'en' | 'ne',
        location: {
          province: formData.location.province || undefined,
          district: formData.location.district || undefined
        },
        status: 'open' as const,
        media: mediaData,
        score: 0
      };

      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('problems')
        .insert(problemData)
        .select()
        .single();

      if (error) {
        console.error('Error creating problem:', error);
        toast.error(locale === 'en' ? 'Failed to submit problem' : 'समस्या पेश गर्न असफल');
        return;
      }

      toast.success(locale === 'en' ? 'Problem submitted successfully!' : 'समस्या सफलतापूर्वक पेश गरियो!');

      // Redirect to the new problem page
      router.push(`/${locale}/problems/${data.id}`);

    } catch (error) {
      console.error('Error submitting problem:', error);
      toast.error(locale === 'en' ? 'An error occurred while submitting' : 'पेश गर्दा त्रुटि देखा पर्‍यो');
    } finally {
      setLoading(false);
    }
  };

  const removeMediaFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-nepal-crimson" />
              {locale === 'en' ? 'Problem Details' : 'समस्याको विवरण'}
            </CardTitle>
            <CardDescription>
              {locale === 'en'
                ? 'Describe your problem clearly and provide as much context as possible.'
                : 'आफ्नो समस्यालाई स्पष्ट रूपमा वर्णन गर्नुहोस् र यथासम्भव धेरै सन्दर्भ प्रदान गर्नुहोस्।'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  {locale === 'en' ? 'Problem Title' : 'समस्याको शीर्षक'} *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={locale === 'en'
                    ? 'e.g., Solar power solution for remote village schools'
                    : 'जस्तै, दुर्गम गाउँका विद्यालयहरूका लागि सौर्य ऊर्जा समाधान'
                  }
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  {locale === 'en' ? 'Problem Description' : 'समस्याको विवरण'} *
                </Label>
                <Textarea
                  id="description"
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={locale === 'en'
                    ? 'Describe the problem in detail. Include what you\'ve tried, constraints (budget, time, resources), and what success would look like.'
                    : 'समस्यालाई विस्तारमा वर्णन गर्नुहोस्। तपाईंले के कोसिस गर्नुभएको छ, बाधाहरू (बजेट, समय, स्रोतहरू), र सफलता कस्तो देखिनेछ भन्ने कुरा समावेश गर्नुहोस्।'
                  }
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Category' : 'श्रेणी'} *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={locale === 'en' ? 'Select category' : 'श्रेणी छनौट गर्नुहोस्'} />
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

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">{locale === 'en' ? 'Tags' : 'ट्यागहरू'}</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder={locale === 'en'
                    ? 'e.g., solar, education, energy, rural'
                    : 'जस्तै, सौर्य, शिक्षा, ऊर्जा, ग्रामीण'
                  }
                />
                <p className="text-sm text-gray-500">
                  {locale === 'en'
                    ? 'Separate tags with commas'
                    : 'ट्यागहरूलाई अल्पविरामले छुट्याउनुहोस्'
                  }
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Location (Optional)' : 'स्थान (वैकल्पिक)'}</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={formData.location.province}
                    onValueChange={(value) => handleLocationChange('province', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={locale === 'en' ? 'Province' : 'प्रदेश'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="province-1">{locale === 'en' ? 'Province 1' : 'प्रदेश १'}</SelectItem>
                      <SelectItem value="madhesh">{locale === 'en' ? 'Madhesh' : 'मधेश'}</SelectItem>
                      <SelectItem value="bagmati">{locale === 'en' ? 'Bagmati' : 'बागमती'}</SelectItem>
                      <SelectItem value="gandaki">{locale === 'en' ? 'Gandaki' : 'गण्डकी'}</SelectItem>
                      <SelectItem value="lumbini">{locale === 'en' ? 'Lumbini' : 'लुम्बिनी'}</SelectItem>
                      <SelectItem value="karnali">{locale === 'en' ? 'Karnali' : 'कर्णाली'}</SelectItem>
                      <SelectItem value="sudurpashchim">{locale === 'en' ? 'Sudurpashchim' : 'सुदूरपश्चिम'}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={formData.location.district}
                    onChange={(e) => handleLocationChange('district', e.target.value)}
                    placeholder={locale === 'en' ? 'District/Municipality' : 'जिल्ला/नगरपालिका'}
                  />
                </div>
              </div>

              {/* Media Upload */}
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Media (Optional)' : 'मिडिया (वैकल्पिक)'}</Label>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-nepal-crimson transition-colors cursor-pointer"
                    onClick={() => document.getElementById('media-upload')?.click()}
                  >
                    <input
                      id="media-upload"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => handleMediaUpload(e.target.files)}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {locale === 'en'
                        ? 'Click to upload or drag and drop images/videos'
                        : 'अपलोड गर्न क्लिक गर्नुहोस् वा तस्विर/भिडिओ तान्नुहोस्'
                      }
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {locale === 'en' ? 'Max 10MB per file' : 'प्रति फाइल अधिकतम १० एमबी'}
                    </p>
                  </div>

                  {/* Show uploaded files */}
                  {formData.media.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        {locale === 'en' ? 'Uploaded Files:' : 'अपलोड गरिएका फाइलहरू:'}
                      </Label>
                      <div className="space-y-2">
                        {formData.media.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMediaFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {loading
                    ? (locale === 'en' ? 'Submitting...' : 'पेश गर्दै...')
                    : (locale === 'en' ? 'Submit Problem' : 'समस्या पेश गर्नुहोस्')
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Lightbulb className="h-5 w-5 mr-2 text-nepal-saffron" />
              {locale === 'en' ? 'Writing Tips' : 'लेखन सुझावहरू'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">
                {locale === 'en' ? 'Be Specific' : 'विशिष्ट हुनुहोस्'}
              </h4>
              <p className="text-sm text-gray-600">
                {locale === 'en'
                  ? 'Include exact locations, numbers, and constraints.'
                  : 'सटीक स्थानहरू, संख्याहरू, र बाधाहरू समावेश गर्नुहोस्।'
                }
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">
                {locale === 'en' ? 'Add Context' : 'प्रसंग थप्नुहोस्'}
              </h4>
              <p className="text-sm text-gray-600">
                {locale === 'en'
                  ? 'Explain why this matters and who it affects.'
                  : 'यो किन महत्वपूर्ण छ र यसले कसलाई असर गर्छ भनेर व्याख्या गर्नुहोस्।'
                }
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">
                {locale === 'en' ? 'Include Photos' : 'फोटोहरू समावेश गर्नुहोस्'}
              </h4>
              <p className="text-sm text-gray-600">
                {locale === 'en'
                  ? 'Visual evidence helps others understand the problem.'
                  : 'दृश्य प्रमाणले अरूलाई समस्या बुझ्न मद्दत गर्छ।'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* License Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {locale === 'en' ? 'Content License' : 'सामग्री लाइसेन्स'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              {locale === 'en'
                ? 'By posting, you agree that your content will be licensed under:'
                : 'पोस्ट गरेर, तपाईं सहमत हुनुहुन्छ कि तपाईंको सामग्री अन्तर्गत लाइसेन्स हुनेछ:'
              }
            </p>
            <Badge variant="outline" className="text-xs">
              CC BY-SA 4.0
            </Badge>
            <p className="text-xs text-gray-500 mt-2">
              {locale === 'en'
                ? 'This allows others to use and build upon your work.'
                : 'यसले अरूलाई तपाईंको कामलाई प्रयोग गर्न र निर्माण गर्न अनुमति दिन्छ।'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}