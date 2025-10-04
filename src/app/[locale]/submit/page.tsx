import { getTranslations } from 'next-intl/server';
import { ProtectedForm } from '@/components/auth/ProtectedForm';
import { ProblemSubmissionForm } from '@/components/forms/ProblemSubmissionForm';

export default async function SubmitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('submit.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Share a real problem you\'re facing in your community. Be specific and include as much detail as possible.'
              : 'आफ्नो समुदायमा सामना गरिरहेको वास्तविक समस्या साझेदारी गर्नुहोस्। विशिष्ट र यथासम्भव विस्तृत जानकारी दिनुहोस्।'
            }
          </p>
        </div>

        <ProtectedForm
          title={locale === 'en' ? 'Sign In to Post Problems' : 'समस्या पोस्ट गर्न साइन इन गर्नुहोस्'}
          description={locale === 'en'
            ? 'Share real problems with the community and get help finding solutions.'
            : 'समुदायसँग वास्तविक समस्याहरू साझेदारी गर्नुहोस् र समाधान खोज्न मद्दत पाउनुहोस्।'
          }
        >
          <ProblemSubmissionForm />
        </ProtectedForm>
      </div>
    </div>
  );
}