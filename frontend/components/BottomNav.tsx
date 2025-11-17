'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Award, Target, MessageCircle, User, Wallet, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Wallet, label: 'Accounts', href: '/accounts' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: TrendingUp, label: 'Invest', href: '/investments' },
  { icon: Award, label: 'Rewards', href: '/rewards' },
  { icon: MessageCircle, label: 'Support', href: '/support' },
  { icon: User, label: 'Profile', href: '/profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-2xl"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-teal-600" 
                  : "text-blue-900 hover:text-teal-600"
              )}
            >
              <div className={cn(
                "relative",
                isActive && "animate-slide-up"
              )}>
                <Icon className="w-6 h-6" />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-teal-600 rounded-full" />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

