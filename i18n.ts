import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'ne'] as const
export type Locale = typeof locales[number]

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  }
})
