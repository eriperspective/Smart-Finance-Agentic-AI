'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Bell } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { AuthGuard } from '@/components/AuthGuard'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

interface Stock {
  id: number
  name: string
  symbol: string
  shares: number
  price: number
  change: number
  changePercent: number
  logo: string
  chartData: number[]
}

export default function InvestmentsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [stocks, setStocks] = useState<Stock[]>([
    {
      id: 1,
      name: 'Apple',
      symbol: 'AAPL',
      shares: 3500,
      price: 280.43,
      change: 3.15,
      changePercent: 13,
      logo: '🍎',
      chartData: [0, 2, 1, 3, 2, 4, 3, 5, 4, 6]
    },
    {
      id: 2,
      name: 'Amazon',
      symbol: 'AMZN',
      shares: 2800,
      price: 187.32,
      change: 4.87,
      changePercent: 24,
      logo: 'a',
      chartData: [0, 1, 2, 1, 3, 2, 4, 3, 5, 6]
    }
  ])

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks =>
        prevStocks.map(stock => {
          const priceChange = (Math.random() - 0.5) * 2
          const newPrice = stock.price + priceChange
          const newChange = stock.change + priceChange
          const newChangePercent = (newChange / (newPrice - newChange)) * 100
          
          return {
            ...stock,
            price: Number(newPrice.toFixed(2)),
            change: Number(newChange.toFixed(2)),
            changePercent: Number(newChangePercent.toFixed(2))
          }
        })
      )
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const totalBalance = stocks.reduce((sum, stock) => sum + (stock.shares * stock.price), 0)
  const totalChange = stocks.reduce((sum, stock) => sum + (stock.shares * stock.change), 0)
  const totalChangePercent = (totalChange / (totalBalance - totalChange)) * 100

  // Mini chart component
  const MiniChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    }).join(' ')
    
    return (
      <svg className="w-full h-16" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#14b8a6', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke="url(#chartGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <AuthGuard>
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-600 via-blue-900 to-slate-900">
      {/* Decorative Spheres */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400/60 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/50 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/3"></div>
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-cyan-400/60 rounded-full blur-[120px] translate-x-1/3"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-500/50 rounded-full blur-[100px]"></div>

    <div className="container mx-auto p-4 max-w-md space-y-4 pb-24 relative z-10">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="p-3 rounded-full bg-white/30 backdrop-blur-lg border-2 border-white/50 shadow-lg hover:bg-white/40 transition-all mb-4"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      {/* Header with User Info */}
      <div className="flex items-center justify-between pt-2 mb-4">
        <div>
          <p className="text-lg text-gray-300">Good Morning,</p>
          <p className="font-semibold text-teal-400 text-lg">{user?.name || 'Perspective Client'}</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-white/20 transition-all relative"
          >
            <Bell className="w-6 h-6 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-teal-50 rounded-xl">
                  <p className="text-sm font-semibold text-teal-900">Apple Stock Alert</p>
                  <p className="text-xs text-teal-700 mt-1">AAPL is up 13% today!</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-sm font-semibold text-blue-900">Amazon Stock Alert</p>
                  <p className="text-xs text-blue-700 mt-1">AMZN reached a new high of $187.32</p>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-900">Portfolio Update</p>
                  <p className="text-xs text-gray-700 mt-1">Your portfolio value increased by 18%</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invest Title */}
      <h2 className="text-5xl mb-3" style={{ fontFamily: 'var(--font-dancing-script)', color: 'white' }}>Invest</h2>
      
      {/* Total Balance Card */}
      <Card className="border-0 shadow-2xl backdrop-blur-2xl border-2 border-white/50 rounded-3xl overflow-hidden relative bg-gradient-to-br from-teal-600 via-blue-900 to-slate-900">
        <CardContent className="p-6">
          {/* Content */}
          <div>
            <div className="flex items-start justify-between mb-8">
              <p className="text-sm font-semibold text-teal-400">Total Balance</p>
              <div className="bg-teal-500 px-3 py-1 rounded-full">
                <span className="text-xs font-semibold text-white">+{totalChangePercent.toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <h3 className="text-4xl font-bold text-white">
                {formatCurrency(totalBalance)}
              </h3>
              <span className="text-sm font-medium text-white/80 mb-1.5">USD</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <div>
        <h3 className="font-semibold text-teal-500 mb-3">AI Recommendations</h3>
        <div className="grid grid-cols-2 gap-3">
          {stocks.slice(0, 2).map((stock) => (
            <Card key={stock.id} className="shadow-lg bg-white rounded-2xl border-0">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg" style={{ color: '#1e3a8a' }}>{stock.name}</h4>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold text-teal-500">{stock.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${
                    stock.changePercent > 0 ? 'text-teal-600' : 'text-red-600'
                  }`}>
                    {stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%
                  </span>
                </div>
                <div>
                  <MiniChart data={stock.chartData} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Portfolio Overview */}
      <div>
        <h3 className="font-semibold text-teal-500 mb-3">Portfolio Overview</h3>
        <div className="space-y-3">
          {stocks.map((stock) => {
            const stockValue = stock.shares * stock.price
            const isPositive = stock.changePercent > 0
            
            return (
              <Card key={stock.id} className="shadow-2xl backdrop-blur-2xl bg-white/30 border-2 border-white/50 rounded-2xl" style={{ backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 10px 25px rgba(0, 0, 0, 0.3)' }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center p-2" style={{
                        backgroundColor: '#1e3a8a'
                      }}>
                        {stock.symbol === 'AAPL' && (
                          <Image 
                            src="/apple-logo.svg" 
                            alt="Apple Logo" 
                            width={32} 
                            height={32}
                            className="w-full h-full object-contain"
                          />
                        )}
                        {stock.symbol === 'AMZN' && (
                          <Image 
                            src="/amazon-logo.svg" 
                            alt="Amazon Logo" 
                            width={32} 
                            height={32}
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-teal-500">{stock.name}</p>
                        <p className="text-sm text-gray-300">{stock.shares.toLocaleString()} shares</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        ${stock.price.toFixed(2)}
                      </p>
                      <p className={`text-sm font-medium ${
                        isPositive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isPositive ? '+' : ''}{stock.changePercent}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
    </div>
    </AuthGuard>
  )
}

