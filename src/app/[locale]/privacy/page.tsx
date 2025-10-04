import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {locale === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}
          </h1>
          <p className="text-xl text-gray-600">
            {locale === 'en'
              ? 'How we collect, use, and protect your information.'
              : 'हामी तपाईंको जानकारी कसरी सङ्कलन, प्रयोग र सुरक्षा गर्छौं।'
            }
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === 'en' ? 'Information We Collect' : 'हामीले सङ्कलन गर्ने जानकारी'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  {locale === 'en' ? 'Account Information' : 'खाता जानकारी'}
                </h3>
                <p className="text-gray-700">
                  {locale === 'en'
                    ? 'When you create an account, we collect your email address and display name. We may also collect your avatar image if you choose to upload one.'
                    : 'जब तपाईं खाता सिर्जना गर्नुहुन्छ, हामी तपाईंको इमेल ठेगाना र प्रदर्शन नाम सङ्कलन गर्छौं। यदि तपाईंले अपलोड गर्न रोज्नुभयो भने हामी तपाईंको अवतार छवि पनि सङ्कलन गर्न सक्छौं।'
                  }
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {locale === 'en' ? 'Content You Share' : 'तपाईंले साझेदारी गर्ने सामग्री'}
                </h3>
                <p className="text-gray-700">
                  {locale === 'en'
                    ? 'All problems, comments, and solution attempts you post are public and visible to all users. This includes any images or documents you upload.'
                    : 'तपाईंले पोस्ट गर्ने सबै समस्याहरू, टिप्पणीहरू, र समाधान प्रयासहरू सार्वजनिक हुन्छन् र सबै प्रयोगकर्ताहरूलाई देखिने हुन्छन्। यसमा तपाईंले अपलोड गर्ने कुनै पनि छविहरू वा कागजातहरू समावेश छन्।'
                  }
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {locale === 'en' ? 'Usage Data' : 'प्रयोग डेटा'}
                </h3>
                <p className="text-gray-700">
                  {locale === 'en'
                    ? 'We collect information about how you use the platform, including pages visited, actions taken, and interaction patterns. This helps us improve the platform.'
                    : 'हामी तपाईंले प्लेटफर्म कसरी प्रयोग गर्नुहुन्छ भन्ने बारेमा जानकारी सङ्कलन गर्छौं, पृष्ठहरू भ्रमण गरिएको, कार्यहरू गरिएको, र अन्तरक्रिया ढाँचाहरू सहित। यसले हामीलाई प्लेटफर्म सुधार गर्न मद्दत गर्छ।'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {locale === 'en' ? 'How We Use Your Information' : 'हामी तपाईंको जानकारी कसरी प्रयोग गर्छौं'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-nepal-crimson rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    {locale === 'en'
                      ? 'To provide and maintain the platform services'
                      : 'प्लेटफर्म सेवाहरू प्रदान गर्न र कायम राख्न'
                    }
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-nepal-crimson rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    {locale === 'en'
                      ? 'To send you important updates about your account and the platform'
                      : 'तपाईंको खाता र प्लेटफर्मको बारेमा महत्वपूर्ण अपडेटहरू पठाउन'
                    }
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-nepal-crimson rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    {locale === 'en'
                      ? 'To improve platform features and user experience'
                      : 'प्लेटफर्म सुविधाहरू र प्रयोगकर्ता अनुभव सुधार गर्न'
                    }
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-nepal-crimson rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    {locale === 'en'
                      ? 'To moderate content and ensure community guidelines are followed'
                      : 'सामग्री मध्यस्थता गर्न र सामुदायिक दिशानिर्देशहरू पालना गरिएको सुनिश्चित गर्न'
                    }
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {locale === 'en' ? 'Information Sharing' : 'जानकारी साझेदारी'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                {locale === 'en'
                  ? 'We do not sell, trade, or rent your personal information to third parties. We may share information in these limited circumstances:'
                  : 'हामी तपाईंको व्यक्तिगत जानकारी तेस्रो पक्षहरूलाई बेच्दैनौं, व्यापार गर्दैनौं, वा भाडामा दिदैनौं। हामी यी सीमित परिस्थितिहरूमा जानकारी साझेदारी गर्न सक्छौं:'
                }
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    {locale === 'en'
                      ? 'When required by law or legal process'
                      : 'जब कानून वा कानुनी प्रक्रियाले आवश्यक पार्छ'
                    }
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    {locale === 'en'
                      ? 'To protect the rights and safety of our users and community'
                      : 'हाम्रा प्रयोगकर्ताहरू र समुदायको अधिकार र सुरक्षा सुरक्षित गर्न'
                    }
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {locale === 'en' ? 'Data Security' : 'डेटा सुरक्षा'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {locale === 'en'
                  ? 'We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest using industry-standard protocols.'
                  : 'हामी तपाईंको जानकारीलाई अनधिकृत पहुँच, परिवर्तन, खुलासा, वा विनाशबाट सुरक्षा गर्न उपयुक्त सुरक्षा उपायहरू लागू गर्छौं। सबै डेटा उद्योग-मानक प्रोटोकलहरू प्रयोग गरेर ट्रान्जिट र आरामको समयमा एन्क्रिप्ट गरिएको छ।'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {locale === 'en' ? 'Your Rights' : 'तपाईंका अधिकारहरू'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  {locale === 'en' ? 'Access and Update' : 'पहुँच र अपडेट'}
                </h3>
                <p className="text-gray-700">
                  {locale === 'en'
                    ? 'You can access and update your account information at any time through your profile settings.'
                    : 'तपाईं आफ्नो प्रोफाइल सेटिङहरू मार्फत जुनसुकै समय आफ्नो खाता जानकारी पहुँच र अपडेट गर्न सक्नुहुन्छ।'
                  }
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {locale === 'en' ? 'Content Control' : 'सामग्री नियन्त्रण'}
                </h3>
                <p className="text-gray-700">
                  {locale === 'en'
                    ? 'You can edit or delete your posts, comments, and attempts at any time. Note that deleted content may remain in backups for a limited time.'
                    : 'तपाईं जुनसुकै समय आफ्ना पोस्टहरू, टिप्पणीहरू, र प्रयासहरू सम्पादन वा मेटाउन सक्नुहुन्छ। मेटाइएको सामग्री सीमित समयका लागि ब्याकअपहरूमा रहन सक्छ भन्ने कुरा नोट गर्नुहोस्।'
                  }
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {locale === 'en' ? 'Account Deletion' : 'खाता मेटाउने'}
                </h3>
                <p className="text-gray-700">
                  {locale === 'en'
                    ? 'You can request account deletion at any time. Your personal information will be removed, but your public contributions may remain to preserve community discussions.'
                    : 'तपाईं जुनसुकै समय खाता मेटाउने अनुरोध गर्न सक्नुहुन्छ। तपाईंको व्यक्तिगत जानकारी हटाइनेछ, तर सामुदायिक छलफलहरू सुरक्षित राख्न तपाईंका सार्वजनिक योगदानहरू रहन सक्छन्।'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {locale === 'en' ? 'Contact Us' : 'हामीलाई सम्पर्क गर्नुहोस्'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {locale === 'en'
                  ? 'If you have questions about this privacy policy or how we handle your information, please contact our moderators through the platform or post in our community discussions.'
                  : 'यदि तपाईंसँग यो गोपनीयता नीति वा हामीले तपाईंको जानकारी कसरी ह्यान्डल गर्छौं भन्ने बारेमा प्रश्नहरू छन् भने, कृपया प्लेटफर्म मार्फत हाम्रा मॉडरेटरहरूलाई सम्पर्क गर्नुहोस् वा हाम्रो सामुदायिक छलफलमा पोस्ट गर्नुहोस्।'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}