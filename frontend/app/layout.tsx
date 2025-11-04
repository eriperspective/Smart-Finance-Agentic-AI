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
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-coral-50 via-purple-50 to-blue-50 pb-20">
            {children}
          </div>
          {!isLoginPage && <BottomNav />}
          {!isLoginPage && !isSupportPage && <FloatingAIButton />}
        </AuthProvider>
      </body>
    </html>
  )
}

