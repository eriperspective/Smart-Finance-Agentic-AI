'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, formatNumber, calculateProgress } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Target, Award, Menu, X, Home, Wallet, MessageCircle, User } from 'lucide-react'
import { CelebrationModal } from '@/components/CelebrationModal'
import { AuthGuard } from '@/components/AuthGuard'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Dashboard() {
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()

  // Float animation keyframes
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      .float-animation {
        animation: float 3s ease-in-out infinite;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
  useEffect(() => {
    const updateDate = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }
      setCurrentDate(now.toLocaleDateString('en-US', options))
    }
    updateDate()
    const interval = setInterval(updateDate, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])
  
  const userData = {
    name: user?.name || 'Perspective Client',
    totalBalance: 1440000.00,
    balanceChange: 12,
    savedThisMonth: 2800.00,
    savingsGoal: 5000.00,
    rewardsPoints: 881000,
    recentTransactions: [
      { id: 1, description: 'Starbucks', amount: -4.50, date: 'Today' },
      { id: 2, description: 'Salary Deposit', amount: 6923.08, date: 'Oct 30' },
      { id: 3, description: 'Whole Foods', amount: -217.32, date: 'Oct 29' },
    ]
  }

  // Save user data to localStorage for AI personalization
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData))
  }, [userData.totalBalance, userData.savedThisMonth, userData.savingsGoal, userData.rewardsPoints])

  const savingsProgress = calculateProgress(userData.savedThisMonth, userData.savingsGoal)

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Wallet, label: 'Accounts', href: '/accounts' },
    { icon: Target, label: 'Goals', href: '/goals' },
    { icon: TrendingUp, label: 'Investments', href: '/investments' },
    { icon: Award, label: 'Rewards', href: '/rewards' },
    { icon: MessageCircle, label: 'Support', href: '/support' },
    { icon: User, label: 'Profile', href: '/profile' },
  ]

  return (
    <AuthGuard>
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-600 via-blue-900 to-slate-900">
      {/* Decorative Spheres */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400/60 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/50 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/3"></div>
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-cyan-400/60 rounded-full blur-[120px] translate-x-1/3"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-500/50 rounded-full blur-[100px]"></div>
      
    <div className="container mx-auto p-4 max-w-md space-y-6 pb-24 relative z-10">
      {/* Hamburger Menu Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-3 rounded-full bg-white/30 backdrop-blur-lg border-2 border-white/50 shadow-lg hover:bg-white/40 transition-all"
          aria-label="Menu"
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-teal-600 via-blue-900 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-teal-400 pl-16">Menu</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-full hover:bg-teal-500/20 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-teal-500/30 text-white shadow-lg'
                      : 'text-white/80 hover:bg-teal-500/20 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Date Display */}
      <div className="text-center">
        <p className="text-sm font-medium text-blue-900 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg inline-block shadow-sm">
          {currentDate}
        </p>
      </div>
      {/* Welcome Section with Glassmorphism */}
      <div className="gradient-mixed border-0 shadow-xl rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-base text-white">Good Morning,</p>
            <h1 className="text-2xl font-bold text-teal-400">{userData.name}</h1>
            <p className="text-xs text-white mt-1">Your Finances Are Doing Great!</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-900 flex items-center justify-center text-white font-bold text-xl shadow-lg float-animation">
            {userData.name.charAt(0)}
          </div>
        </div>

        {/* Balance Card */}
        <div className="mt-6">
          <p className="text-sm text-coral-400 mb-1">Total Balance</p>
          <div className="flex items-end gap-3">
            <h2 className="text-4xl font-bold text-teal-400">
              {formatCurrency(userData.totalBalance)}
            </h2>
            <div className="flex items-center gap-1 mb-1">
              {userData.balanceChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                userData.balanceChange > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {userData.balanceChange}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Savings Progress */}
        <Card className="border-0 shadow-2xl backdrop-blur-2xl bg-white/30 border-2 border-white/50" style={{ backdropFilter: 'blur(20px)' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-coral-300" />
              <p className="text-xs font-medium text-teal-400">Monthly Goal</p>
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              {savingsProgress}%
            </p>
            <Progress value={savingsProgress} className="h-2" />
            <p className="text-xs text-white mt-2">
              {formatCurrency(userData.savedThisMonth)} of {formatCurrency(userData.savingsGoal)}
            </p>
          </CardContent>
        </Card>

        {/* Rewards Points */}
        <Card className="border-0 shadow-2xl backdrop-blur-2xl bg-white/30 border-2 border-white/50" style={{ backdropFilter: 'blur(20px)' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-sm bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-md">
                <Award className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-medium text-teal-400">Rewards</p>
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              {formatNumber(userData.rewardsPoints)}
            </p>
            <div className="h-2 w-full bg-gradient-to-r from-teal-400 to-blue-900 rounded-full"></div>
            <p className="text-xs text-white mt-2">Platinum Tier</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-2xl backdrop-blur-2xl bg-white/30 border-2 border-white/50" style={{ backdropFilter: 'blur(20px)' }}>
        <CardHeader>
          <CardTitle className="text-lg text-teal-400">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {userData.recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.amount > 0 ? 'bg-green-100' : 'bg-coral-200'
                }`}>
                  <DollarSign className={`w-5 h-5 ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-coral-500'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{transaction.description}</p>
                  <p className="text-xs text-white/80">{transaction.date}</p>
                </div>
              </div>
              <p className={`font-semibold ${
                transaction.amount > 0 ? 'text-green-400' : 'text-coral-300'
              }`}>
                {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Recommendations Card */}
      <Card className="gradient-mixed border-0 shadow-xl text-white">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-2">AI Recommendations</h3>
          <p className="text-sm opacity-90">
            You're on track to reach your savings goal! Continue saving {formatCurrency(2200)} 
            more this month to hit your target.
          </p>
        </CardContent>
      </Card>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        achievement="savings_goal"
        amount={500}
      />
    </div>
    </div>
    </AuthGuard>
  )
}

