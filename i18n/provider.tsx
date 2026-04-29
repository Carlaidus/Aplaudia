"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Locale, defaultLocale, locales } from "./config"
import esMessages from "./messages/es.json"
import caMessages from "./messages/ca.json"
import enMessages from "./messages/en.json"

type Messages = typeof esMessages

const messages: Record<Locale, Messages> = {
  es: esMessages,
  ca: caMessages,
  en: enMessages,
}

type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  messages: Messages
}

const I18nContext = createContext<I18nContextType | null>(null)

const STORAGE_KEY = "aplaudia-locale"

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".")
  let value: unknown = obj
  
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key]
    } else {
      return path // Return the key if not found
    }
  }
  
  return typeof value === "string" ? value : path
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load saved locale from localStorage
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && locales.includes(saved)) {
      setLocaleState(saved)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0] as Locale
      if (locales.includes(browserLang)) {
        setLocaleState(browserLang)
      }
    }
    setMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
    // Update HTML lang attribute
    document.documentElement.lang = newLocale
  }

  const t = (key: string): string => {
    return getNestedValue(messages[locale] as unknown as Record<string, unknown>, key)
  }

  // Prevent hydration mismatch by rendering with default locale until mounted
  const currentLocale = mounted ? locale : defaultLocale
  const currentMessages = messages[currentLocale]

  return (
    <I18nContext.Provider value={{ locale: currentLocale, setLocale, t, messages: currentMessages }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

export function useTranslations(namespace?: string) {
  const { t, messages, locale } = useI18n()
  
  const translate = (key: string): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return t(fullKey)
  }
  
  return { t: translate, messages, locale }
}
