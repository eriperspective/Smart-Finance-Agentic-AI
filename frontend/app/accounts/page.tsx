'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Wallet, CreditCard, ArrowLeft } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { AuthGuard } from '@/components/AuthGuard'
import { useRouter } from 'next/navigation'

export default function AccountsPage() {
  const router = useRouter()
  
  const accountsData = {
    checking: {
      name: 'Checking Account',
      accountNumber: '****4523',
      balance: 240000.00,
      type: 'checking'
    },
    savings: {
      name: 'Savings Account',
      accountNumber: '****7891',
      balance: 1200000.00,
      type: 'savings'
    },
    creditCards: [
      {
        id: 1,
        name: 'Platinum Rewards',
        cardNumber: '**** **** **** 3421',
        balance: 10340.75,
        limit: 260340.75,
        expiry: '12/27'
      },
      {
        id: 2,
        name: 'Travel Elite',
        cardNumber: '**** **** **** 8765',
        balance: 5890.50,
        limit: 116890.50,
        expiry: '09/26'
      }
    ]
  }

  return (
    <AuthGuard>
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-600 via-blue-900 to-slate-900">
      {/* Decorative Spheres */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400/60 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/50 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/3"></div>
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-cyan-400/60 rounded-full blur-[120px] translate-x-1/3"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-500/50 rounded-full blur-[100px]"></div>
      
    <div className="container mx-auto p-4 max-w-md space-y-6 pb-24 relative z-10">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="p-3 rounded-full bg-white/30 backdrop-blur-lg border-2 border-white/50 shadow-lg hover:bg-white/40 transition-all"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      {/* Header */}
      <div className="text-left mb-6">
        <h1 className="font-dancing-script text-5xl text-white mb-2">Accounts</h1>
        <p className="text-teal-200 font-medium">Manage Your Banking Accounts</p>
      </div>

      {/* Bank Accounts Section */}
      <div className="space-y-3">
        {/* Checking Account */}
        <Card className="border-0 shadow-2xl backdrop-blur-2xl bg-white/30 border-2 border-white/50 overflow-hidden" style={{ backdropFilter: 'blur(20px)' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-teal-400 text-base">{accountsData.checking.name}</h3>
                  <p className="text-xs text-white/80">{accountsData.checking.accountNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">
                  {formatCurrency(accountsData.checking.balance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Savings Account */}
        <Card className="border-0 shadow-2xl backdrop-blur-2xl bg-white/30 border-2 border-white/50 overflow-hidden" style={{ backdropFilter: 'blur(20px)' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-teal-400 text-base">{accountsData.savings.name}</h3>
                  <p className="text-xs text-white/80">{accountsData.savings.accountNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">
                  {formatCurrency(accountsData.savings.balance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Cards Section */}
      <div className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold text-white ml-2">Credit Cards</h2>
        
        {accountsData.creditCards.map((card) => (
          <div 
            key={card.id}
            className="relative rounded-xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 50%, #0e7490 100%)',
              aspectRatio: '2.2/1',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Card Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
            </div>
            
            {/* Card Content */}
            <div className="relative p-5 h-full flex flex-col justify-between text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs opacity-80 mb-0.5">Credit Card</p>
                  <h3 className="text-base font-bold">{card.name}</h3>
                </div>
                <CreditCard className="w-7 h-7 opacity-80" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xl font-mono tracking-wider">
                    {card.cardNumber}
                  </p>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs opacity-70 mb-0.5">Valid Thru</p>
                    <p className="text-sm font-semibold">{card.expiry}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-70 mb-0.5">Available Credit</p>
                    <p className="text-base font-bold">
                      {formatCurrency(card.limit - card.balance)}
                    </p>
                  </div>
                </div>
                
                <div className="pt-1.5 border-t border-white/20">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">Balance:</span>
                    <span className="font-semibold">{formatCurrency(card.balance)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-0.5">
                    <span className="opacity-80">Limit:</span>
                    <span className="font-semibold">{formatCurrency(card.limit)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl text-white bg-gradient-to-br from-teal-600 via-blue-900 to-slate-900">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
          <p className="text-sm opacity-90">
            Transfer funds between accounts, pay bills, or schedule automatic payments directly from your accounts.
          </p>
        </CardContent>
      </Card>
    </div>
    </div>
    </AuthGuard>
  )
}

