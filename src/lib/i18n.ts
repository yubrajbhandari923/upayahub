import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'ne'] as const
export type Locale = typeof locales[number]

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale = locales.includes(locale as any) ? locale : 'en'

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  }
})