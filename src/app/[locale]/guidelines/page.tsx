import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Shield, Heart, Users } from 'lucide-react';

export default async function GuidelinesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {locale === 'en' ? 'Community Guidelines' : 'सामुदायिक दिशानिर्देशहरू'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {locale === 'en'
              ? 'These guidelines help us maintain a supportive, productive, and respectful community where everyone can contribute to solving real problems.'
              : 'यी दिशानिर्देशहरूले हामीलाई एक सहयोगी, उत्पादक, र सम्मानजनक समुदाय कायम राख्न मद्दत गर्छ जहाँ सबैले वास्तविक समस्याहरू समाधान गर्न योगदान दिन सक्छन्।'
            }
          </p>
        </div>

        {/* Core Principles */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Heart className="h-6 w-6 mr-3 text-nepal-crimson" />
              {locale === 'en' ? 'Core Principles' : 'मूल सिद्धान्तहरू'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">
                  {locale === 'en' ? 'Focus on Real Problems' : 'वास्तविक समस्याहरूमा ध्यान दिनुहोस्'}
                </h3>
                <p className="text-gray-700">
                  {locale === 'en'
                    ? 'Share actual challenges you or your community are facing. Theoretical or hypothetical problems belong elsewhere.'
                    : 'तपाईं वा तपाईंको समुदायले सामना गरिरहेका वास्तविक चुनौतीहरू साझेदारी गर्नुहोस्। सैद्धान्तिक वा काल्पनिक समस्याहरू अन्यत्र राख्नुहोस्।'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">
                  {locale === 'en' ? 'Embrace Learning from Failure' : 'असफलताबाट सिकाइलाई अँगाल्नुहोस्'}
                </h3>
                <p className="text-gray-700">
                  {locale === 'en'
                    ? 'Failed attempts are valuable learning opportunities. Share what didn\'t work and why—it helps the next person avoid the same pitfalls.'
                    : 'असफल प्रयासहरू मूल्यवान सिकाइका अवसरहरू हुन्। के काम गरेन र किन भनेर साझेदारी गर्नुहोस्—यसले अर्को व्यक्तिलाई उही खडलहरूबाट बच्न मद्दत गर्छ।'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">
                  {locale === 'en' ? 'Be Respectful and Constructive' : 'सम्मानजनक र रचनात्मक हुनुहोस्'}
                </h3>
                <p className="text-gray-700">
                  {locale === 'en'
                    ? 'Treat everyone with respect. Offer constructive feedback and solutions, not just criticism.'
                    : 'सबैलाई सम्मानसाथ व्यवहार गर्नुहोस्। केवल आलोचना नभएर रचनात्मक प्रतिक्रिया र समाधानहरू प्रस्ताव गर्नुहोस्।'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What to Post */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-green-700">
                <CheckCircle className="h-5 w-5 mr-2" />
                {locale === 'en' ? 'Good Posts Include' : 'राम्रो पोस्टहरूमा समावेश'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  {locale === 'en'
                    ? 'Specific location and context'
                    : 'विशिष्ट स्थान र प्रसंग'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  {locale === 'en'
                    ? 'Clear photos or documentation'
                    : 'स्पष्ट फोटोहरू वा दस्तावेजीकरण'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  {locale === 'en'
                    ? 'Budget and resource constraints'
                    : 'बजेट र स्रोत बाधाहरू'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  {locale === 'en'
                    ? 'What you\'ve already tried'
                    : 'तपाईंले पहिले नै के कोसिस गर्नुभएको छ'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  {locale === 'en'
                    ? 'Timeline and urgency level'
                    : 'समयसीमा र तत्कालताको स्तर'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-red-700">
                <XCircle className="h-5 w-5 mr-2" />
                {locale === 'en' ? 'Avoid These' : 'यीबाट बच्नुहोस्'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  {locale === 'en'
                    ? 'Vague or theoretical problems'
                    : 'अस्पष्ट वा सैद्धान्तिक समस्याहरू'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  {locale === 'en'
                    ? 'Requests for personal gain only'
                    : 'केवल व्यक्तिगत फाइदाका लागि अनुरोधहरू'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  {locale === 'en'
                    ? 'Promotional or commercial content'
                    : 'प्रवर्धनात्मक वा व्यावसायिक सामग्री'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  {locale === 'en'
                    ? 'Hate speech or discrimination'
                    : 'घृणाजनक भाषण वा भेदभाव'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  {locale === 'en'
                    ? 'Political campaigning'
                    : 'राजनीतिक प्रचार'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commenting Guidelines */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Users className="h-6 w-6 mr-3 text-nepal-blue" />
              {locale === 'en' ? 'Discussion Guidelines' : 'छलफल दिशानिर्देशहरू'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Badge variant="outline" className="mr-2 text-xs">IDEAS</Badge>
                {locale === 'en' ? 'Sharing Ideas' : 'विचारहरू साझेदारी'}
              </h3>
              <p className="text-gray-700 text-sm">
                {locale === 'en'
                  ? 'Propose specific, actionable solutions. Include implementation details when possible.'
                  : 'विशिष्ट, कार्यान्वयनयोग्य समाधानहरू प्रस्ताव गर्नुहोस्। सम्भव भएसम्म कार्यान्वयन विवरणहरू समावेश गर्नुहोस्।'
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Badge variant="outline" className="mr-2 text-xs">QUESTIONS</Badge>
                {locale === 'en' ? 'Asking Questions' : 'प्रश्नहरू सोध्दै'}
              </h3>
              <p className="text-gray-700 text-sm">
                {locale === 'en'
                  ? 'Ask for clarification, additional context, or specific details that would help you contribute better.'
                  : 'स्पष्टीकरण, थप प्रसंग, वा विशिष्ट विवरणहरूका लागि सोध्नुहोस् जसले तपाईंलाई राम्रो योगदान दिन मद्दत गर्नेछ।'
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Badge variant="outline" className="mr-2 text-xs">RESOURCES</Badge>
                {locale === 'en' ? 'Sharing Resources' : 'स्रोतहरू साझेदारी'}
              </h3>
              <p className="text-gray-700 text-sm">
                {locale === 'en'
                  ? 'Share relevant links, documents, contacts, or tools. Explain why each resource is helpful.'
                  : 'सान्दर्भिक लिङ्कहरू, दस्तावेजहरू, सम्पर्कहरू, वा उपकरणहरू साझेदारी गर्नुहोस्। प्रत्येक स्रोत किन उपयोगी छ भनेर व्याख्या गर्नुहोस्।'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Moderation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Shield className="h-6 w-6 mr-3 text-nepal-green" />
              {locale === 'en' ? 'Community Moderation' : 'सामुदायिक मॉडरेसन'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                {locale === 'en' ? 'Voting System' : 'मतदान प्रणाली'}
              </h3>
              <p className="text-gray-700 mb-3">
                {locale === 'en'
                  ? 'Use upvotes for helpful content and downvotes for content that doesn\'t follow guidelines. Voting helps surface the best solutions.'
                  : 'उपयोगी सामग्रीका लागि अपभोट र दिशानिर्देशहरू पालना नगर्ने सामग्रीका लागि डाउनभोट प्रयोग गर्नुहोस्। मतदानले उत्कृष्ट समाधानहरू सतहमा ल्याउन मद्दत गर्छ।'
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                {locale === 'en' ? 'Reporting Content' : 'सामग्री रिपोर्ट गर्दै'}
              </h3>
              <p className="text-gray-700 mb-3">
                {locale === 'en'
                  ? 'Report content that violates guidelines. Choose the appropriate reason and provide context if needed.'
                  : 'दिशानिर्देशहरू उल्लङ्घन गर्ने सामग्री रिपोर्ट गर्नुहोस्। उपयुक्त कारण छनौट गर्नुहोस् र आवश्यक भएमा प्रसंग प्रदान गर्नुहोस्।'
                }
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <Badge variant="outline">{locale === 'en' ? 'Spam' : 'स्प्याम'}</Badge>
                <Badge variant="outline">{locale === 'en' ? 'Abuse' : 'दुर्व्यवहार'}</Badge>
                <Badge variant="outline">{locale === 'en' ? 'Misinformation' : 'गलत जानकारी'}</Badge>
                <Badge variant="outline">{locale === 'en' ? 'Duplicate' : 'नक्कली'}</Badge>
                <Badge variant="outline">{locale === 'en' ? 'Off-topic' : 'विषयभन्दा बाहिर'}</Badge>
                <Badge variant="outline">{locale === 'en' ? 'Other' : 'अन्य'}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consequences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <AlertTriangle className="h-6 w-6 mr-3 text-nepal-saffron" />
              {locale === 'en' ? 'Consequences' : 'परिणामहरू'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'Violations of these guidelines may result in:'
                : 'यी दिशानिर्देशहरूको उल्लङ्घनले निम्न परिणामहरू निम्त्याउन सक्छ:'
              }
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">
                  {locale === 'en' ? 'Content removal or editing' : 'सामग्री हटाउने वा सम्पादन'}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">
                  {locale === 'en' ? 'Temporary posting restrictions' : 'अस्थायी पोस्टिङ प्रतिबन्धहरू'}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">
                  {locale === 'en' ? 'Account suspension for repeated violations' : 'दोहोरिने उल्लङ्घनका लागि खाता निलम्बन'}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}