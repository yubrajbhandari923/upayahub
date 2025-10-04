import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Lightbulb, Heart, Globe } from 'lucide-react';
import { FeedbackForm } from '@/components/forms/FeedbackForm';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-baseline mb-6">
            <span className="text-5xl font-bold text-nepal-crimson">उपाय</span>
            <span className="text-2xl font-semibold text-nepal-blue align-super">hub</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {locale === 'en' ? 'About Our Platform' : 'हाम्रो प्लेटफर्मको बारेमा'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {locale === 'en'
              ? 'A community-driven platform where Nepali people share real problems, collaborate on solutions, and learn from each other\'s experiences.'
              : 'एक समुदायिक प्लेटफर्म जहाँ नेपाली जनताले वास्तविक समस्याहरू साझेदारी गर्छन्, समाधानमा सहयोग गर्छन्, र एकअर्काका अनुभवहरूबाट सिक्छन्।'
            }
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Heart className="h-6 w-6 mr-3 text-nepal-crimson" />
              {locale === 'en' ? 'Our Mission' : 'हाम्रो उद्देश्य'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 leading-relaxed">
              {locale === 'en'
                ? 'We believe that every problem is an opportunity for collective learning and innovation. Our platform connects problem-solvers across Nepal, fostering collaboration that leads to real, sustainable solutions for our communities.'
                : 'हामी विश्वास गर्छौं कि हरेक समस्या सामूहिक सिकाइ र नवाचारको अवसर हो। हाम्रो प्लेटफर्मले नेपालभरका समस्या समाधानकर्ताहरूलाई जोड्छ, सहयोगलाई बढावा दिन्छ जसले हाम्रा समुदायहरूका लागि वास्तविक, दिगो समाधानहरू निम्त्याउँछ।'
              }
            </p>
          </CardContent>
        </Card>

        {/* How it Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {locale === 'en' ? 'How It Works' : 'यसो काम गर्छ'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-nepal-crimson/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-nepal-crimson" />
                </div>
                <CardTitle>
                  {locale === 'en' ? 'Share Problems' : 'समस्या साझेदारी गर्नुहोस्'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {locale === 'en'
                    ? 'Post real challenges from your community with photos, constraints, and detailed context to help others understand the situation.'
                    : 'आफ्नो समुदायका वास्तविक चुनौतीहरू फोटो, बाधाहरू, र विस्तृत प्रसंगसहित पोस्ट गर्नुहोस् ताकि अरूले स्थिति बुझ्न सकून्।'
                  }
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-nepal-green/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-nepal-green" />
                </div>
                <CardTitle>
                  {locale === 'en' ? 'Collaborate' : 'सहयोग गर्नुहोस्'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {locale === 'en'
                    ? 'Engage in meaningful discussions, share resources, ask questions, and brainstorm innovative solutions together.'
                    : 'अर्थपूर्ण छलफलमा संलग्न हुनुहोस्, स्रोतहरू साझेदारी गर्नुहोस्, प्रश्नहरू सोध्नुहोस्, र सँगै नवाचार समाधानहरू खोज्नुहोस्।'
                  }
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-nepal-saffron/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <Lightbulb className="h-8 w-8 text-nepal-saffron" />
                </div>
                <CardTitle>
                  {locale === 'en' ? 'Learn & Improve' : 'सिक्नुहोस् र सुधार गर्नुहोस्'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {locale === 'en'
                    ? 'Document solution attempts—both successful and failed—so the entire community can learn and build upon previous efforts.'
                    : 'समाधान प्रयासहरूको दस्तावेजीकरण गर्नुहोस्—सफल र असफल दुवै—ताकि सम्पूर्ण समुदायले सिक्न र अघिल्लो प्रयासहरूमा निर्माण गर्न सकून्।'
                  }
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Globe className="h-6 w-6 mr-3 text-nepal-blue" />
              {locale === 'en' ? 'Our Values' : 'हाम्रा मूल्यहरू'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {locale === 'en' ? 'Community First' : 'समुदाय पहिले'}
              </h3>
              <p className="text-gray-700">
                {locale === 'en'
                  ? 'Every decision we make prioritizes the needs and wellbeing of Nepali communities.'
                  : 'हामीले गर्ने हरेक निर्णयले नेपाली समुदायहरूको आवश्यकता र कल्याणलाई प्राथमिकता दिन्छ।'
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {locale === 'en' ? 'Learning from Failure' : 'असफलताबाट सिकाइ'}
              </h3>
              <p className="text-gray-700">
                {locale === 'en'
                  ? 'We celebrate attempts, even when they don\'t work. Failed experiments teach the next team faster paths to success.'
                  : 'हामी प्रयासहरूको सम्मान गर्छौं, असफल भए पनि। असफल प्रयोगहरूले अर्को टोलीलाई सफलताको छिटो बाटो सिकाउँछन्।'
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {locale === 'en' ? 'Open Collaboration' : 'खुला सहयोग'}
              </h3>
              <p className="text-gray-700">
                {locale === 'en'
                  ? 'Knowledge and solutions belong to everyone. We share openly so that good ideas can spread and improve.'
                  : 'ज्ञान र समाधानहरू सबैका हुन्। हामी खुलेर साझेदारी गर्छौं ताकि राम्रो विचारहरू फैलिन र सुधार हुन सकून्।'
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {locale === 'en' ? 'Sustainable Impact' : 'दिगो प्रभाव'}
              </h3>
              <p className="text-gray-700">
                {locale === 'en'
                  ? 'We focus on solutions that create lasting positive change, considering environmental, social, and economic sustainability.'
                  : 'हामी दिगो सकारात्मक परिवर्तन सिर्जना गर्ने समाधानहरूमा ध्यान दिन्छौं, वातावरणीय, सामाजिक, र आर्थिक दिगोपनालाई विचार गर्दै।'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Get Involved */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {locale === 'en' ? 'Join Our Community' : 'हाम्रो समुदायमा सामेल हुनुहोस्'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-700 mb-6">
              {locale === 'en'
                ? 'Whether you\'re facing a challenge, have expertise to share, or simply want to learn from others, there\'s a place for you in our community.'
                : 'तपाईं चुनौतीको सामना गरिरहनुभएको छ, साझेदारी गर्न विशेषज्ञता छ, वा केवल अरूबाट सिक्न चाहनुहुन्छ भने, हाम्रो समुदायमा तपाईंको लागि ठाउँ छ।'
              }
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-nepal-crimson/5 rounded-lg">
                <h4 className="font-semibold mb-2">
                  {locale === 'en' ? 'Problem Poster' : 'समस्या पोस्टर'}
                </h4>
                <p className="text-sm text-gray-600">
                  {locale === 'en'
                    ? 'Share challenges from your community'
                    : 'आफ्नो समुदायका चुनौतीहरू साझेदारी गर्नुहोस्'
                  }
                </p>
              </div>
              <div className="p-4 bg-nepal-green/5 rounded-lg">
                <h4 className="font-semibold mb-2">
                  {locale === 'en' ? 'Solution Builder' : 'समाधान निर्माणकर्ता'}
                </h4>
                <p className="text-sm text-gray-600">
                  {locale === 'en'
                    ? 'Contribute ideas and attempt solutions'
                    : 'विचारहरू योगदान दिनुहोस् र समाधान प्रयास गर्नुहोस्'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Form */}
        <FeedbackForm locale={locale} />
      </div>
    </div>
  );
}