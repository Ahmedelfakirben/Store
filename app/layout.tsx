import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { CartProvider } from '@/hooks/useCart'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SettingsProvider } from '@/hooks/useSettings'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollToTop from '@/components/ScrollToTop'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shopping by Lina - Boutique de Mode en Ligne',
  description: 'Vente de marques 100% originales 📍 Avenue Aljoulane, Tétouan. Découvrez notre collection tendance et élégante.',
  icons: {
    icon: [
      { url: '/logo.jpg?v=2', type: 'image/jpeg' },
    ],
    shortcut: ['/logo.jpg?v=2'],
    apple: [
      { url: '/logo.jpg?v=2', sizes: '180x180', type: 'image/jpeg' },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#ec4899',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Shopping by Lina',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/logo.jpg?v=3" />
        <link rel="apple-touch-icon" href="/logo.jpg?v=3" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <SettingsProvider>
            <AuthProvider>
              <CartProvider>
                <Navbar />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
                <WhatsAppButton />
                <Suspense fallback={null}>
                  <ScrollToTop />
                </Suspense>
              </CartProvider>
            </AuthProvider>
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
