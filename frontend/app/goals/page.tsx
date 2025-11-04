'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Target, TrendingUp, Calendar, Plus, Check, Edit2, Trash2, X, Heart, Plane, Laptop, Home, Car, GraduationCap, ShoppingBag, Briefcase, Wallet, Palmtree, ArrowLeft } from 'lucide-react'
import { formatCurrency, calculateProgress } from '@/lib/utils'
import { CelebrationModal } from '@/components/CelebrationModal'
import { AuthGuard } from '@/components/AuthGuard'
import { useRouter } from 'next/navigation'

interface SavingsGoal {
  id: number
  title: string
  current: number
  target: number
  deadline: string
  color: string
  icon: string
}

const defaultGoals: SavingsGoal[] = [
  {
    id: 1,
    title: 'Emergency Fund',
    current: 3800,
    target: 5000,
    deadline: '2025-12-31',
    color: 'from-blue-400 to-blue-600',
    icon: 'Heart'
  },
  {
    id: 2,
    title: 'Vacation to Hawaii',
    current: 1200,
    target: 3000,
    deadline: '2026-06-30',
    color: 'from-coral-400 to-coral-600',
    icon: 'Palmtree'
  },
  {
    id: 3,
    title: 'New Laptop',
    current: 800,
    target: 1500,
    deadline: '2026-03-31',
    color: 'from-purple-400 to-purple-600',
    icon: 'Laptop'
  },
]

// Helper function to format date for display
const formatDeadline = (dateString: string): string => {
  if (!dateString) return 'No deadline'
  
  // If it's already in a friendly format (old data), return as is
  if (dateString.includes(' ')) return dateString
  
  // If it's in YYYY-MM-DD format, convert it
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return dateString
  }
}

const colorOptions = [
  'from-blue-400 to-blue-600',
  'from-coral-400 to-coral-600',
  'from-purple-400 to-purple-600',
  'from-green-400 to-green-600',
  'from-yellow-400 to-yellow-600',
  'from-pink-400 to-pink-600',
  'from-indigo-400 to-indigo-600',
]

const iconOptions = ['Heart', 'Palmtree', 'Laptop', 'Home', 'Car', 'GraduationCap', 'ShoppingBag', 'Briefcase', 'Wallet', 'Plane']

// Icon component mapping
const iconComponents: Record<string, any> = {
  Heart,
  Palmtree,
  Laptop,
  Home,
  Car,
  GraduationCap,
  ShoppingBag,
  Briefcase,
  Wallet,
  Plane,
}

export default function GoalsPage() {
  const router = useRouter()
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationGoal, setCelebrationGoal] = useState<SavingsGoal | null>(null)
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [showDialog, setShowDialog] = useState<string | false>(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    current: 0,
    target: 0,
    deadline: '',
    color: colorOptions[0],
    icon: 'Heart',
  })

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

  // Migration function to convert old emoji icons to new icon names
  const migrateIconFormat = (goals: SavingsGoal[]): SavingsGoal[] => {
    const emojiToIconMap: Record<string, string> = {
      '🏥': 'Heart',
      '🏖️': 'Palmtree',
      '💻': 'Laptop',
      '🏠': 'Home',
      '🚗': 'Car',
      '🎓': 'GraduationCap',
      '💍': 'ShoppingBag',
      '🎸': 'Briefcase',
      '📱': 'Laptop',
      '✈️': 'Plane',
    }
    
    return goals.map(goal => ({
      ...goal,
      icon: emojiToIconMap[goal.icon] || goal.icon || 'Heart'
    }))
  }

  // Load goals from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('savingsGoals')
    if (stored) {
      const loadedGoals = JSON.parse(stored)
      const migratedGoals = migrateIconFormat(loadedGoals)
      setSavingsGoals(migratedGoals)
      // Save migrated goals back to localStorage
      localStorage.setItem('savingsGoals', JSON.stringify(migratedGoals))
    } else {
      setSavingsGoals(defaultGoals)
      localStorage.setItem('savingsGoals', JSON.stringify(defaultGoals))
    }
  }, [])

  // Auto-save goals to localStorage whenever they change
  useEffect(() => {
    if (savingsGoals.length > 0) {
      localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals))
    }
  }, [savingsGoals])

  const monthlyContributions = [
    { month: 'Oct', amount: 5200 },
    { month: 'Sep', amount: 4850 },
    { month: 'Aug', amount: 6100 },
    { month: 'Jul', amount: 5500 },
  ]

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current, 0)
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0)
  const overallProgress = calculateProgress(totalSaved, totalTarget)

  const handleCheckGoal = (goal: SavingsGoal) => {
    if (calculateProgress(goal.current, goal.target) >= 100) {
      setCelebrationGoal(goal)
      setShowCelebration(true)
    }
  }

  const openCreateDialog = () => {
    setEditingGoal(null)
    setFormData({
      title: '',
      current: 0,
      target: 0,
      deadline: '',
      color: colorOptions[0],
      icon: 'Heart',
    })
    setShowDialog('goal')
  }

  const openEditDialog = (goal: SavingsGoal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      current: goal.current,
      target: goal.target,
      deadline: goal.deadline,
      color: goal.color,
      icon: goal.icon,
    })
    setShowDialog('goal')
  }

  const handleSaveGoal = () => {
    if (!formData.title || formData.target <= 0) {
      alert('Please fill in all required fields')
      return
    }

    if (editingGoal) {
      // Update existing goal
      setSavingsGoals(goals =>
        goals.map(g =>
          g.id === editingGoal.id
            ? { ...g, ...formData }
            : g
        )
      )
    } else {
      // Create new goal
      const newGoal: SavingsGoal = {
        id: Date.now(),
        ...formData,
      }
      setSavingsGoals(goals => [...goals, newGoal])
    }

    setShowDialog(false)
  }

  const handleSaveAutoSave = () => {
    const autoSaveSettings = localStorage.getItem('autoSaveSettings')
    if (autoSaveSettings) {
      const settings = JSON.parse(autoSaveSettings)
      if (settings.enabled) {
        alert(`Auto-Save is now active!\n\nAmount: $${settings.amount}/month\nDay: ${settings.day === 'last' ? 'Last day of month' : settings.day === '15' ? '15th' : '1st'}\n\nYour savings will grow automatically each month.`)
      }
    }
    setShowDialog(false)
  }

  const handleDeleteGoal = (id: number) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      setSavingsGoals(goals => goals.filter(g => g.id !== id))
    }
  }

  const handleUpdateProgress = (id: number, newCurrent: number) => {
    setSavingsGoals(goals =>
      goals.map(g =>
        g.id === id ? { ...g, current: newCurrent } : g
      )
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
        <h1 className="mb-2">
          <span className="font-dancing-script text-white text-5xl">Goals</span>
        </h1>
        <p className="text-teal-200 font-medium">Track Your Financial Progress</p>
      </div>

      {/* Overall Progress Card */}
      <Card className="border-0 shadow-2xl backdrop-blur-2xl bg-white/30 border-2 border-white/50" style={{ backdropFilter: 'blur(20px)' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-300 mb-1">Total Saved</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalSaved)}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg float-animation">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-200">Goal: {formatCurrency(totalTarget)}</span>
                    <span className="font-semibold text-teal-400">{overallProgress}%</span>
                  </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Individual Goals */}
      <div className="space-y-4">
        {savingsGoals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target)
          const isComplete = progress >= 100
          
          return (
            <Card key={goal.id} className="shadow-2xl overflow-hidden backdrop-blur-2xl bg-white/30 border-2 border-white/50" style={{ backdropFilter: 'blur(20px)' }}>
              <div className={`h-2 bg-gradient-to-r ${goal.color}`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      {iconComponents[goal.icon] && React.createElement(iconComponents[goal.icon], { className: "w-5 h-5 text-teal-400" })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-teal-400 text-lg">{goal.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-300" />
                        <p className="text-xs text-gray-300">{formatDeadline(goal.deadline)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditDialog(goal)}
                      className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                      aria-label="Edit goal"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    {isComplete && (
                      <button
                        onClick={() => handleCheckGoal(goal)}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg hover:from-teal-600 hover:to-teal-800 transition-colors"
                        aria-label="Celebrate goal"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: '#FF7F7F' }}
                      aria-label="Delete goal"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-200 font-medium">
                      {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                    </span>
                    <span className="font-semibold text-teal-400">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2.5" />
                  {!isComplete && (
                    <>
                      <p className="text-xs text-gray-300 mt-2">
                        {formatCurrency(goal.target - goal.current)} remaining
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleUpdateProgress(goal.id, goal.current + 50)}
                        >
                          + $50
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleUpdateProgress(goal.id, goal.current + 100)}
                        >
                          + $100
                        </Button>
                      </div>
                    </>
                  )}
                  {isComplete && (
                    <p className="text-xs text-teal-300 font-semibold mt-2">
                      Goal completed! Tap the checkmark to celebrate
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add New Goal Button */}
      <Button 
        onClick={openCreateDialog}
        className="w-full h-14 bg-gradient-to-r from-blue-900 to-teal-600 hover:from-slate-900 hover:to-teal-700 text-white font-semibold shadow-lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create New Goal
      </Button>

      {/* Monthly Contributions */}
      <Card className="border-0 shadow-2xl backdrop-blur-2xl bg-white/30 border-2 border-white/50" style={{ backdropFilter: 'blur(20px)' }}>
        <CardHeader>
          <CardTitle className="text-lg text-teal-400">Monthly Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyContributions.map((contribution, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg transition-all hover:bg-white/10 hover:shadow-md cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-teal-400" />
                  </div>
                  <span className="font-medium text-blue-900">{contribution.month}</span>
                </div>
                <span className="font-semibold text-white">
                  {formatCurrency(contribution.amount)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Save Tip */}
      <Card className="border-0 shadow-xl text-white bg-gradient-to-br from-teal-600 via-blue-900 to-slate-900">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-2">Tip: Set up Auto-Save</h3>
          <p className="text-sm opacity-90 mb-4">
            Automatically transfer a fixed amount to your savings goals every month. 
            Consistent contributions help you reach your financial goals faster!
          </p>
          <Button 
            variant="secondary" 
            className="w-full bg-teal-600 text-white hover:bg-teal-700 border-0"
            onClick={() => setShowDialog('autosave')}
          >
            Set Up Auto-Save
          </Button>
        </CardContent>
      </Card>

      {celebrationGoal && (
        <CelebrationModal
          isOpen={showCelebration}
          onClose={() => {
            setShowCelebration(false)
            setCelebrationGoal(null)
          }}
          achievement="savings_goal"
          amount={celebrationGoal.target}
        />
      )}

      {/* Create/Edit Goal Dialog */}
      <Dialog open={showDialog === 'goal'} onOpenChange={(open) => setShowDialog(open ? 'goal' : false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Goal Name</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., Emergency Fund"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Current Amount ($)</label>
              <input
                type="number"
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Amount ($)</label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <div className="grid grid-cols-5 gap-2">
                {iconOptions.map((iconName) => {
                  const IconComponent = iconComponents[iconName]
                  return (
                    <button
                      key={iconName}
                      onClick={() => setFormData({ ...formData, icon: iconName })}
                      className={`p-3 rounded-lg border-2 hover:bg-teal-50 transition-colors flex items-center justify-center ${
                        formData.icon === iconName ? 'border-teal-600 bg-teal-50' : 'border-gray-200'
                      }`}
                    >
                      {IconComponent && <IconComponent className="w-6 h-6 text-teal-600" />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color Theme</label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`h-12 rounded-lg bg-gradient-to-r ${color} border-2 ${
                      formData.color === color ? 'border-gray-900' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveGoal}
                className="flex-1 bg-gradient-to-r from-blue-900 to-teal-600 hover:from-slate-900 hover:to-teal-700 text-white"
              >
                {editingGoal ? 'Save Changes' : 'Create Goal'}
              </Button>
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auto-Save Settings Dialog */}
      <Dialog open={showDialog === 'autosave'} onOpenChange={(open) => setShowDialog(open ? 'autosave' : false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-teal-600">Auto-Save Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">Monthly Amount ($)</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="5000"
                defaultValue="5000"
                id="autoSaveAmount"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: $3,000 - $10,000/month</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">Day of Month</label>
              <select 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                id="autoSaveDay"
              >
                <option value="1">1st</option>
                <option value="15">15th</option>
                <option value="last">Last day</option>
              </select>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-900 to-teal-600 hover:from-slate-900 hover:to-teal-700 text-white"
              onClick={() => {
                const amount = (document.getElementById('autoSaveAmount') as HTMLInputElement)?.value || '5000'
                const day = (document.getElementById('autoSaveDay') as HTMLSelectElement)?.value || '1'
                const settings = {
                  enabled: true,
                  amount: parseFloat(amount),
                  day: day,
                }
                localStorage.setItem('autoSaveSettings', JSON.stringify(settings))
                handleSaveAutoSave()
              }}
            >
              Activate Auto-Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </div>
    </AuthGuard>
  )
}

