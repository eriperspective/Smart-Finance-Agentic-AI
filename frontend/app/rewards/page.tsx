'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Trophy, Star, Gift, Award, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react'
import { formatNumber, getRewardsTier, calculateProgress } from '@/lib/utils'
import { CelebrationModal } from '@/components/CelebrationModal'
import { useRouter } from 'next/navigation'

export default function RewardsPage() {
  const router = useRouter()
  const [showCelebration, setShowCelebration] = useState(false)
  
  const currentPoints = 881000
  const tierInfo = getRewardsTier(currentPoints)
  const progressToNextTier = tierInfo.nextTierPoints 
    ? calculateProgress(currentPoints, tierInfo.nextTierPoints)
    : 100

  const recentActivity = [
    { id: 1, description: 'Mortgage Payment', points: 4500, date: 'Today' },
    { id: 2, description: 'Utility Bills Bundle', points: 850, date: 'Oct 30' },
    { id: 3, description: 'Property Tax Payment', points: 3200, date: 'Oct 28' },
    { id: 4, description: 'Investment Transfer', points: 5000, date: 'Oct 26' },
    { id: 5, description: 'Insurance Premium', points: 1250, date: 'Oct 25' },
  ]

  const tierBenefits = {
    Silver: ['1x Points On All Purchases', 'Standard Customer Support', 'Mobile Banking'],
    Gold: ['2x Points On All Purchases', 'Priority Support', 'Free ATM Withdrawals', 'Cashback On Dining'],
    Platinum: ['3x Points On All Purchases', 'Dedicated Account Manager', 'Premium Travel Insurance', 'Airport Lounge Access', 'Annual Bonus Points'],
  }

  return (
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
        <h1 className="font-dancing-script text-5xl text-white mb-2">Rewards</h1>
        <p className="text-teal-200 font-medium">Track Your Points And Tier Benefits</p>
      </div>

      {/* Current Tier Card with Glassmorphism */}
      <Card className="border-0 shadow-2xl backdrop-blur-2xl bg-white/30 border-2 border-white/50 overflow-hidden" style={{ backdropFilter: 'blur(20px)' }}>
        <div className={`h-32 bg-gradient-to-r ${tierInfo.color} flex items-center justify-center relative`}>
          <div className="absolute top-4 right-4 animate-pulse">
            <Sparkles className="w-6 h-6 text-white/80 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="text-center text-white">
            <Trophy className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">{tierInfo.tier} Tier</h2>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-300 mb-1">Current Points</p>
              <p className="text-3xl font-bold text-white">{formatNumber(currentPoints)}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>

          {tierInfo.nextTier && (
            <>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-200">Progress to {tierInfo.nextTier}</p>
                  <p className="text-sm font-semibold text-teal-400">{progressToNextTier}%</p>
                </div>
                <Progress value={progressToNextTier} className="h-3" />
                <p className="text-xs text-gray-300 mt-2">
                  {tierInfo.nextTierPoints! - currentPoints} points to go
                </p>
              </div>
            </>
          )}

          {!tierInfo.nextTier && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-900 to-teal-600 rounded-lg">
              <p className="text-sm font-semibold text-white text-center">
                You've reached the highest tier!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tier Benefits */}
      <Card className="border-0 shadow-2xl backdrop-blur-2xl bg-white/30 border-2 border-white/50" style={{ backdropFilter: 'blur(20px)' }}>
        <CardHeader>
          <CardTitle className="text-lg text-teal-400">Your {tierInfo.tier} Benefits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tierBenefits[tierInfo.tier as keyof typeof tierBenefits].map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Star className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-gray-200 group-hover:text-teal-400 transition-colors">{benefit}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Redeem Options */}
      <Card className="border-0 shadow-2xl backdrop-blur-2xl bg-white/30 border-2 border-white/50" style={{ backdropFilter: 'blur(20px)' }}>
        <CardHeader>
          <CardTitle className="text-lg text-teal-400">Redeem Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-between h-auto py-4 border-2"
            onClick={() => setShowCelebration(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-teal-400 text-base">Cashback</p>
                <p className="text-sm text-gray-400">500 points = $5.00</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-between h-auto py-4 border-2"
            onClick={() => setShowCelebration(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-teal-400 text-base">Gift Cards</p>
                <p className="text-sm text-gray-400">Starting at 1,000 points</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-between h-auto py-4 border-2"
            onClick={() => setShowCelebration(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-900 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-teal-400 text-base">Travel Miles</p>
                <p className="text-sm text-gray-400">1:1 points conversion</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-2xl backdrop-blur-2xl bg-white/30 border-2 border-white/50" style={{ backdropFilter: 'blur(20px)' }}>
        <CardHeader>
          <CardTitle className="text-lg text-teal-400">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white text-sm">{activity.description}</p>
                <p className="text-xs text-gray-300">{activity.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-teal-400 text-sm">+{activity.points}</p>
                <p className="text-xs text-gray-300">points</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        achievement="points_milestone"
        points={currentPoints}
      />
    </div>
    </div>
  )
}

