import type { Metadata, Viewport } from 'next'
import { I18nProvider } from '@/i18n'
import { siteConfig } from '@/content/site'
import { StructuredData } from '@/components/seo/structured-data'
import { MotionPerformanceProvider } from '@/components/motion-performance-provider'
import { AplaudiaAgentWidget } from '@/components/agent/aplaudia-agent-widget'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalUrl),
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  applicationName: siteConfig.name,
  generator: siteConfig.name,
  keywords: [...siteConfig.seo.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: '/',
    siteName: siteConfig.name,
    type: 'website',
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary',
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={siteConfig.primaryLanguage} className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <StructuredData />
        <I18nProvider>
          <MotionPerformanceProvider>
            {children}
            <AplaudiaAgentWidget />
          </MotionPerformanceProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
