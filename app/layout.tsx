import type { Metadata, Viewport } from 'next'
import { I18nProvider } from '@/i18n'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://aplaudia.com'),
  title: 'Aplaudia | Estudio Digital para Negocios',
  description: 'Creamos webs premium, agentes IA para WhatsApp y visuales mejorados con IA para negocios que quieren destacar.',
  generator: 'Aplaudia',
  keywords: ['web design', 'AI WhatsApp', 'digital studio', 'small business', 'Barcelona', 'España'],
  authors: [{ name: 'Aplaudia' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Aplaudia | Estudio Digital para Negocios',
    description: 'Creamos webs premium, agentes IA para WhatsApp y visuales mejorados con IA para negocios que quieren destacar.',
    url: 'https://aplaudia.com',
    siteName: 'Aplaudia',
    type: 'website',
    locale: 'es_ES',
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
    <html lang="es" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
