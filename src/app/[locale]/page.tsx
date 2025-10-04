import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, MessageSquare, Lightbulb, Mountain } from 'lucide-react';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-himalaya to-white py-20 lg:py-32">
        {/* Subtle mountain pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="flex items-end justify-center h-full">
            <Mountain className="h-64 w-64 text-nepal-blue" />
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

          {/* Sample problem cards - these would be dynamic in the real app */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary">
                    {locale === 'en' ? 'Technical' : 'प्राविधिक'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {locale === 'en' ? 'Open' : 'खुला'}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">
                  {locale === 'en'
                    ? 'Solar power solution for remote village schools'
                    : 'दुर्गम गाउँका विद्यालयहरूका लागि सौर्य ऊर्जा समाधान'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 mb-4">
                  {locale === 'en'
                    ? 'Our village school in Dolakha has no electricity. Looking for affordable solar solutions that can power 3 classrooms and basic computers.'
                    : 'दोलखाको हाम्रो गाउँको विद्यालयमा बिजुली छैन। ३ वटा कक्षाकोठा र आधारभूत कम्प्युटरहरू चलाउने सस्तो सौर्य समाधान खोजिरहेका छौं।'
                  }
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>12 {locale === 'en' ? 'discussions' : 'छलफलहरू'}</span>
                  <span>3 {locale === 'en' ? 'attempts' : 'प्रयासहरू'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary">
                    {locale === 'en' ? 'Policy' : 'नीति'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {locale === 'en' ? 'In Progress' : 'प्रगतिमा'}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">
                  {locale === 'en'
                    ? 'Improving waste management in local municipalities'
                    : 'स्थानीय नगरपालिकाहरूमा फोहोर व्यवस्थापन सुधार'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 mb-4">
                  {locale === 'en'
                    ? 'Plastic waste is accumulating in our neighborhood. Need help drafting a proposal for the municipality to implement proper recycling programs.'
                    : 'हाम्रो छिमेकमा प्लास्टिकको फोहोर जम्मा भइरहेको छ। नगरपालिकामा उचित पुनर्चक्रण कार्यक्रमहरू लागू गर्न प्रस्ताव मस्यौदा तयार गर्न मद्दत चाहिन्छ।'
                  }
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>8 {locale === 'en' ? 'discussions' : 'छलफलहरू'}</span>
                  <span>2 {locale === 'en' ? 'attempts' : 'प्रयासहरू'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary">
                    {locale === 'en' ? 'Both' : 'दुवै'}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-green-600">
                    {locale === 'en' ? 'Solved' : 'हल भएको'}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">
                  {locale === 'en'
                    ? 'Digital literacy program for elderly citizens'
                    : 'बुजुर्ग नागरिकहरूका लागि डिजिटल साक्षरता कार्यक्रम'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 mb-4">
                  {locale === 'en'
                    ? 'Many elderly people in our community struggle with smartphones and digital payments. Successfully created a training program with local volunteers.'
                    : 'हाम्रो समुदायका धेरै बुजुर्गहरूलाई स्मार्टफोन र डिजिटल भुक्तानीमा समस्या छ। स्थानीय स्वयंसेवकहरूसँग मिलेर सफलतापूर्वक प्रशिक्षण कार्यक्रम सिर्जना गर्यौं।'
                  }
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>15 {locale === 'en' ? 'discussions' : 'छलफलहरू'}</span>
                  <span>5 {locale === 'en' ? 'attempts' : 'प्रयासहरू'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

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