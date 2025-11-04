import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0
  return Math.min(Math.round((current / target) * 100), 100)
}

export function getRewardsTier(points: number): {
  tier: string
  nextTier: string | null
  nextTierPoints: number | null
  color: string
} {
  if (points < 1000) {
    return {
      tier: 'Silver',
      nextTier: 'Gold',
      nextTierPoints: 1000,
      color: 'from-gray-300 to-gray-500'
    }
  } else if (points < 2500) {
    return {
      tier: 'Gold',
      nextTier: 'Platinum',
      nextTierPoints: 2500,
      color: 'from-yellow-400 to-yellow-600'
    }
  } else {
    return {
      tier: 'Platinum',
      nextTier: null,
      nextTierPoints: null,
      color: 'from-gray-300 to-gray-500'
    }
  }
}

