import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const faqs = [
    {
      question: locale === 'en' ? 'What types of problems can I post?' : 'म कस्ता समस्याहरू पोस्ट गर्न सक्छु?',
      answer: locale === 'en'
        ? 'You can post any real problem affecting your community—technical challenges, policy issues, or a combination of both. Focus on specific, actionable problems rather than theoretical discussions.'
        : 'तपाईं आफ्नो समुदायलाई असर गर्ने कुनै पनि वास्तविक समस्या पोस्ट गर्न सक्नुहुन्छ—प्राविधिक चुनौतीहरू, नीतिगत मुद्दाहरू, वा दुवैको संयोजन। सैद्धान्तिक छलफलभन्दा विशिष्ट, कार्यान्वयनयोग्य समस्याहरूमा ध्यान दिनुहोस्।'
    },
    {
      question: locale === 'en' ? 'Do I need to sign in to browse problems?' : 'समस्याहरू हेर्नका लागि साइन इन गर्नुपर्छ?',
      answer: locale === 'en'
        ? 'No, you can browse and search all problems without signing in. However, you need an account to post problems, comment, vote, or submit solution attempts.'
        : 'होइन, तपाईं साइन इन नगरी सबै समस्याहरू हेर्न र खोज्न सक्नुहुन्छ। तर, समस्याहरू पोस्ट गर्न, टिप्पणी गर्न, भोट दिन, वा समाधान प्रयासहरू पेश गर्न खाता चाहिन्छ।'
    },
    {
      question: locale === 'en' ? 'Should I share failed attempts?' : 'के मैले असफल प्रयासहरू साझेदारी गर्नुपर्छ?',
      answer: locale === 'en'
        ? 'Absolutely! Failed attempts are incredibly valuable because they save others from repeating the same mistakes. Always include what you learned and why it didn\'t work.'
        : 'निश्चित रूपमा! असफल प्रयासहरू अत्यन्त मूल्यवान हुन्छन् किनभने तिनीहरूले अरूलाई उही गल्तीहरू दोहोर्याउनबाट बचाउँछन्। तपाईंले के सिक्नुभयो र किन काम गरेन भन्ने कुरा सधैं समावेश गर्नुहोस्।'
    },
    {
      question: locale === 'en' ? 'Can I edit my posts after publishing?' : 'प्रकाशन गरेपछि के म मेरा पोस्टहरू सम्पादन गर्न सक्छु?',
      answer: locale === 'en'
        ? 'Yes, you can edit your own problems, comments, and attempts. Major edits will be marked with an "edited" timestamp to maintain transparency.'
        : 'हो, तपाईं आफ्ना समस्याहरू, टिप्पणीहरू, र प्रयासहरू सम्पादन गर्न सक्नुहुन्छ। पारदर्शिता कायम राख्न ठूला सम्पादनहरूलाई "सम्पादित" टाइमस्ट्याम्पले चिन्ह लगाइनेछ।'
    },
    {
      question: locale === 'en' ? 'How does the voting system work?' : 'भोटिङ प्रणाली कसरी काम गर्छ?',
      answer: locale === 'en'
        ? 'Use upvotes for helpful, relevant content and downvotes for content that doesn\'t follow guidelines. Voting helps surface the best solutions and maintains content quality.'
        : 'उपयोगी, सान्दर्भिक सामग्रीका लागि अपभोट र दिशानिर्देशहरू पालना नगर्ने सामग्रीका लागि डाउनभोट प्रयोग गर्नुहोस्। भोटिङले उत्कृष्ट समाधानहरू सतहमा ल्याउन र सामग्रीको गुणस्तर कायम राख्न मद्दत गर्छ।'
    },
    {
      question: locale === 'en' ? 'What if my problem gets solved?' : 'मेरो समस्याको समाधान भएमा के गर्ने?',
      answer: locale === 'en'
        ? 'Great! Update your problem status to "Solved" and share what worked. This helps others facing similar challenges and showcases successful community collaboration.'
        : 'राम्रो! आफ्नो समस्याको स्थिति "हल भएको" मा अपडेट गर्नुहोस् र के काम गर्‍यो भनेर साझेदारी गर्नुहोस्। यसले समान चुनौतीहरूको सामना गरिरहेका अरूलाई मद्दत गर्छ र सफल सामुदायिक सहयोग प्रदर्शन गर्छ।'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {locale === 'en' ? 'Frequently Asked Questions' : 'बारम्बार सोधिने प्रश्नहरू'}
          </h1>
          <p className="text-xl text-gray-600">
            {locale === 'en'
              ? 'Find answers to common questions about using our platform.'
              : 'हाम्रो प्लेटफर्म प्रयोग गर्ने बारेमा सामान्य प्रश्नहरूका जवाफहरू फेला पार्नुहोस्।'
            }
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === 'en' ? 'Still have questions?' : 'अझै प्रश्नहरू छन्?'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {locale === 'en'
                  ? 'Feel free to ask in our community discussions or contact our moderators for help.'
                  : 'हाम्रो सामुदायिक छलफलमा सोध्न वा मद्दतका लागि हाम्रा मॉडरेटरहरूलाई सम्पर्क गर्न स्वतन्त्र महसुस गर्नुहोस्।'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}