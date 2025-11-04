'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trophy, Target, Award, Star, Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  achievement: 'savings_goal' | 'tier_upgrade' | 'points_milestone'
  amount?: number
  newTier?: string
  points?: number
}

export function CelebrationModal({
  isOpen,
  onClose,
  achievement,
  amount,
  newTier,
  points,
}: CelebrationModalProps) {
  const confettiColors = ['#FF6B4A', '#8B5CF6', '#FCD34D', '#60A5FA']

  const achievementConfig = {
    savings_goal: {
      icon: Target,
      title: 'Goal Achieved!',
      description: `You've saved ${formatCurrency(amount || 0)}! Great job!`,
      color: 'from-teal-500 to-teal-700',
    },
    tier_upgrade: {
      icon: Trophy,
      title: `Welcome to ${newTier} Tier!`,
      description: 'You\'ve unlocked exclusive benefits!',
      color: 'from-yellow-400 to-orange-500',
    },
    points_milestone: {
      icon: Award,
      title: 'Milestone Reached!',
      description: `You've earned ${points} reward points!`,
      color: 'from-purple-400 to-pink-500',
    },
  }

  const config = achievementConfig[achievement]
  const Icon = config.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0">
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Confetti Animation */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, x: Math.random() * 400 - 200, opacity: 1, rotate: 0 }}
                  animate={{
                    y: 600,
                    x: Math.random() * 400 - 200,
                    opacity: 0,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    ease: 'easeOut',
                  }}
                  className="absolute top-0 left-1/2"
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: confettiColors[i % confettiColors.length],
                    borderRadius: Math.random() > 0.5 ? '50%' : '0',
                  }}
                />
              ))}

              <DialogHeader className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="flex justify-center mb-4"
                >
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-xl`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <DialogTitle className="text-center text-2xl font-bold mb-2">
                    {config.title}
                  </DialogTitle>
                  <DialogDescription className="text-center text-base">
                    {config.description}
                  </DialogDescription>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center gap-2 mt-4"
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                    </motion.div>
                  ))}
                </motion.div>
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-blue-900 to-teal-600 hover:from-slate-900 hover:to-teal-700 text-white font-semibold"
                >
                  Awesome!
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

