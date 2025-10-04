'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Mountain } from 'lucide-react';

export function Footer() {
  const t = useTranslations('navigation');
  const locale = useLocale();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Mountain className="h-6 w-6 text-nepal-crimson" />
              <span className="text-lg font-semibold text-nepal-blue">
                समस्या समाधान
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {locale === 'en'
                ? "A platform where Nepal's community members share real problems and collaborate on solutions. Together, we build a better tomorrow."
                : "नेपालका समुदायका सदस्यहरूले वास्तविक समस्याहरू साझेदारी गर्ने र समाधानमा सहयोग गर्ने मञ्च। सँगै मिलेर, हामी राम्रो भोलि निर्माण गर्छौं।"
              }
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {locale === 'en' ? 'Quick Links' : 'द्रुत लिङ्कहरू'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/problems`}
                  className="text-sm text-gray-600 hover:text-nepal-crimson"
                >
                  {t('problems')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/submit`}
                  className="text-sm text-gray-600 hover:text-nepal-crimson"
                >
                  {t('submit')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-sm text-gray-600 hover:text-nepal-crimson"
                >
                  {t('about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {locale === 'en' ? 'Community' : 'समुदाय'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/guidelines`}
                  className="text-sm text-gray-600 hover:text-nepal-crimson"
                >
                  {t('guidelines')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/faq`}
                  className="text-sm text-gray-600 hover:text-nepal-crimson"
                >
                  {locale === 'en' ? 'FAQ' : 'बारम्बार सोधिने प्रश्नहरू'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm text-gray-600 hover:text-nepal-crimson"
                >
                  {locale === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 समस्या समाधान. {locale === 'en' ? 'All rights reserved.' : 'सबै अधिकार सुरक्षित।'}
            </p>
            <p className="text-sm text-gray-500 mt-2 md:mt-0">
              {locale === 'en'
                ? 'Content licensed under CC BY-SA 4.0'
                : 'सामग्री CC BY-SA 4.0 अन्तर्गत लाइसेन्स प्राप्त'
              }
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}