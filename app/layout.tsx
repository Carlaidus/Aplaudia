import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { I18nProvider } from '@/i18n'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: 'Aplaudia | Estudio Digital para Negocios',
  description: 'Creamos webs premium, agentes IA para WhatsApp y visuales mejorados con IA para negocios que quieren destacar.',
  generator: 'Aplaudia',
  keywords: ['web design', 'AI WhatsApp', 'digital studio', 'small business', 'Barcelona', 'Mexico'],
  authors: [{ name: 'Aplaudia' }],
  openGraph: {
    title: 'Aplaudia | Estudio Digital para Negocios',
    description: 'Creamos webs premium, agentes IA para WhatsApp y visuales mejorados con IA para negocios que quieren destacar.',
    type: 'website',
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
