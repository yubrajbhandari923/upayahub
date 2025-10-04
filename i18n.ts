import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'ne'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  const validLocale = (locales.includes(locale as Locale) ? locale : 'en') as Locale

  return {
    locale: validLocale,
    messages: (await import(`./src/messages/${validLocale}.json`)).default
  }
})
