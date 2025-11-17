'use client'

import { Dancing_Script, Playfair_Display } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/components/BottomNav'
import { FloatingAIButton } from '@/components/FloatingAIButton'
import { AuthProvider } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair-display'
})
const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dancing-script'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'
  const isSupportPage = pathname === '/support'

  return (
    <html lang="en">
      <body className={`${playfairDisplay.className} ${dancingScript.variable} ${playfairDisplay.variable}`}>
        {/* Skip Navigation Link for Keyboard Users */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <div id="main-content" className="min-h-screen bg-gradient-to-br from-coral-50 via-purple-50 to-blue-50 pb-20">
            {children}
          </div>
          {!isLoginPage && <BottomNav />}
          {!isLoginPage && !isSupportPage && <FloatingAIButton />}
        </AuthProvider>
      </body>
    </html>
  )
}

