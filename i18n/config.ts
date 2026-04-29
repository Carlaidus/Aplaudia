export const locales = ['es', 'ca', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'es'

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  ca: 'Català',
  en: 'English',
}

export const localeFlags: Record<Locale, string> = {
  es: '🇪🇸',
  ca: '🇦🇩',
  en: '🇬🇧',
}
