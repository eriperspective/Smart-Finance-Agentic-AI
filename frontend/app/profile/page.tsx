'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  User, Mail, Phone, MapPin, Bell, Shield, CreditCard, 
  Settings, ChevronRight, LogOut, Eye, Edit2, Save, X, Plus, ArrowLeft
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/AuthGuard'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [showDialog, setShowDialog] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: user?.name || 'Perspective Client',
    email: user?.email || 'client@perspective.ai',
    phone: '1 (888) 888-8888',
    address: '144 Main Street',
  })
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false)
  const [autoSaveAmount, setAutoSaveAmount] = useState(100)
  const [autoSaveDay, setAutoSaveDay] = useState('1')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [accessibilityEnabled, setAccessibilityEnabled] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedAutoSave = localStorage.getItem('autoSaveSettings')
    if (storedAutoSave) {
      const settings = JSON.parse(storedAutoSave)
      setAutoSaveEnabled(settings.enabled)
      setAutoSaveAmount(settings.amount)
      setAutoSaveDay(settings.day)
    }
    
    const storedNotifications = localStorage.getItem('notificationsEnabled')
    if (storedNotifications !== null) {
      setNotificationsEnabled(JSON.parse(storedNotifications))
    }

    const storedAccessibility = localStorage.getItem('accessibilitySettings')
    if (storedAccessibility) {
      const settings = JSON.parse(storedAccessibility)
      setAccessibilityEnabled(settings.audioEnabled || false)
      setLargeText(settings.largeText || false)
      setHighContrast(settings.highContrast || false)
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleSaveProfile = () => {
    updateUser({ name: formData.name, email: formData.email })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || 'Perspective Client',
      email: user?.email || 'client@perspective.ai',
      phone: '1 (888) 888-8888',
      address: '144 Main Street',
    })
    setIsEditing(false)
  }

  const handleSaveAutoSave = () => {
    const settings = {
      enabled: autoSaveEnabled,
      amount: autoSaveAmount,
      day: autoSaveDay,
    }
    localStorage.setItem('autoSaveSettings', JSON.stringify(settings))
    setShowDialog(null)
  }

  const handleToggleAutoSave = (enabled: boolean) => {
    setAutoSaveEnabled(enabled)
    const settings = {
      enabled,
      amount: autoSaveAmount,
      day: autoSaveDay,
    }
    localStorage.setItem('autoSaveSettings', JSON.stringify(settings))
  }

  const handleToggleAccessibility = (audioEnabled: boolean) => {
    setAccessibilityEnabled(audioEnabled)
    const settings = {
      audioEnabled,
      largeText,
      highContrast,
    }
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings))
  }

  const handleToggleLargeText = (enabled: boolean) => {
    setLargeText(enabled)
    const settings = {
      audioEnabled: accessibilityEnabled,
      largeText: enabled,
      highContrast,
    }
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings))
    // Apply text size change
    if (enabled) {
      document.documentElement.style.fontSize = '18px'
    } else {
      document.documentElement.style.fontSize = '16px'
    }
  }

  const handleToggleHighContrast = (enabled: boolean) => {
    setHighContrast(enabled)
    const settings = {
      audioEnabled: accessibilityEnabled,
      largeText,
      highContrast: enabled,
    }
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings))
    // Apply high contrast
    if (enabled) {
      document.body.classList.add('high-contrast')
    } else {
      document.body.classList.remove('high-contrast')
    }
  }

  const handleToggleNotifications = (enabled: boolean) => {
    setNotificationsEnabled(enabled)
    localStorage.setItem('notificationsEnabled', JSON.stringify(enabled))
  }

  const handleChangePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      alert('Please fill in all password fields')
      return
    }
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match')
      return
    }
    if (passwordData.new.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }
    // In a real app, this would call an API to change the password
    alert('Password changed successfully!')
    setPasswordData({ current: '', new: '', confirm: '' })
    setShowDialog(null)
  }

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    localStorage.setItem('twoFactorEnabled', JSON.stringify(!twoFactorEnabled))
    if (!twoFactorEnabled) {
      alert('Two-Factor Authentication enabled! In a real app, you would scan a QR code.')
    } else {
      alert('Two-Factor Authentication disabled!')
    }
  }

  const settingsDialogs = {
    'accessibility': (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-teal-600">Audio Assistance</p>
            <p className="text-sm text-gray-600">Text-to-speech for all interactions</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleAccessibility(!accessibilityEnabled)}
            className={accessibilityEnabled ? "bg-teal-600 text-white hover:bg-teal-700 border-teal-600" : "bg-white text-gray-700 hover:bg-gray-50"}
          >
            {accessibilityEnabled ? 'On' : 'Off'}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-teal-600">Large Text</p>
            <p className="text-sm text-gray-600">Increase font size for better readability</p>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleToggleLargeText(!largeText)}
            className={largeText ? "bg-teal-600 text-white hover:bg-teal-700 border-teal-600" : "bg-white text-gray-700 hover:bg-gray-50"}
          >
            {largeText ? 'On' : 'Off'}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-teal-600">High Contrast</p>
            <p className="text-sm text-gray-600">Enhanced color contrast</p>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleToggleHighContrast(!highContrast)}
            className={highContrast ? "bg-teal-600 text-white hover:bg-teal-700 border-teal-600" : "bg-white text-gray-700 hover:bg-gray-50"}
          >
            {highContrast ? 'On' : 'Off'}
          </Button>
        </div>
      </div>
    ),
    'notifications': (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Push Notifications</p>
            <p className="text-sm text-gray-600">Get alerts for important updates</p>
          </div>
          <Button
            variant={notificationsEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => handleToggleNotifications(!notificationsEnabled)}
          >
            {notificationsEnabled ? 'On' : 'Off'}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Alerts</p>
            <p className="text-sm text-gray-600">Receive transaction summaries</p>
          </div>
          <Button variant="default" size="sm">On</Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Goals Reminders</p>
            <p className="text-sm text-gray-600">Weekly savings goal updates</p>
          </div>
          <Button variant="default" size="sm">On</Button>
        </div>
      </div>
    ),
    'autosave': (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-teal-600">Enable Auto-Save</p>
            <p className="text-sm text-gray-600">Automatically save to your goals</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleAutoSave(!autoSaveEnabled)}
            className={autoSaveEnabled ? "bg-teal-600 text-white hover:bg-teal-700 border-teal-600" : "bg-white text-gray-700 hover:bg-gray-50"}
          >
            {autoSaveEnabled ? 'On' : 'Off'}
          </Button>
        </div>
        {autoSaveEnabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">Monthly Amount ($)</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="100"
                value={autoSaveAmount}
                onChange={(e) => setAutoSaveAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">Day of Month</label>
              <select 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={autoSaveDay}
                onChange={(e) => setAutoSaveDay(e.target.value)}
              >
                <option value="1">1st</option>
                <option value="15">15th</option>
                <option value="last">Last day</option>
              </select>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-900 to-teal-600 hover:from-slate-900 hover:to-teal-700 text-white"
              onClick={handleSaveAutoSave}
            >
              Save Auto-Save Settings
            </Button>
          </>
        )}
      </div>
    ),
    'payment': (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="font-medium text-sm">•••• 4242</p>
                  <p className="text-xs text-gray-600">Expires 12/25</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">Edit</Button>
            </div>
            <p className="text-xs text-green-600 font-medium">Primary</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  MC
                </div>
                <div>
                  <p className="font-medium text-sm">•••• 8888</p>
                  <p className="text-xs text-gray-600">Expires 09/26</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">Edit</Button>
            </div>
          </div>
        </div>

        <Button className="w-full" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>

        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-3">Linked Bank Accounts</h4>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Chase Checking ****3456</p>
                <p className="text-xs text-gray-600">Linked for auto-save</p>
              </div>
              <Button size="sm" variant="ghost">Manage</Button>
            </div>
          </div>
        </div>
      </div>
    ),
    'security': (
      <div className="space-y-6">
        <div className="space-y-4 border-b pb-4">
          <h3 className="font-semibold text-sm">Change Password</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              value={passwordData.current}
              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.new}
              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Confirm new password"
            />
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-blue-900 to-teal-600 hover:from-slate-900 hover:to-teal-700 text-white"
            onClick={handleChangePassword}
          >
            Update Password
          </Button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-gray-600">Add an extra layer of security</p>
          </div>
          <Button
            variant={twoFactorEnabled ? "default" : "outline"}
            size="sm"
            onClick={handleToggleTwoFactor}
          >
            {twoFactorEnabled ? 'On' : 'Off'}
          </Button>
        </div>

        <div className="space-y-2">
          <Button className="w-full justify-start" variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            Manage Trusted Devices
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            View Login History
          </Button>
          <Button className="w-full justify-start text-red-600 hover:text-red-700" variant="outline">
            Deactivate Account
          </Button>
        </div>
      </div>
    ),
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
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-teal-200 font-medium">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <Card className="glass border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-900 to-teal-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {formData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-2xl font-bold text-blue-900 border-b-2 border-teal-500 focus:outline-none bg-transparent w-full"
                />
              ) : (
                <h2 className="text-2xl font-bold text-blue-900">{formData.name}</h2>
              )}
              <p className="text-sm text-teal-600 font-semibold">Premium Checking</p>
              <p className="text-xs text-gray-500 mt-1">Member since January 2024</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-teal-600" />
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="text-gray-700 border-b border-gray-300 focus:outline-none focus:border-teal-500 bg-transparent flex-1"
                />
              ) : (
                <span className="text-gray-700">{formData.email}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-teal-600" />
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="text-gray-700 border-b border-gray-300 focus:outline-none focus:border-teal-500 bg-transparent flex-1"
                />
              ) : (
                <span className="text-gray-700">{formData.phone}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-teal-600" />
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="text-gray-700 border-b border-gray-300 focus:outline-none focus:border-teal-500 bg-transparent flex-1"
                />
              ) : (
                <span className="text-gray-700">{formData.address}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSaveProfile}
                  className="flex-1 bg-gradient-to-r from-blue-900 to-teal-600 hover:from-slate-900 hover:to-teal-700 text-white font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r from-blue-900 to-teal-600 hover:from-slate-900 hover:to-teal-700 text-white font-semibold"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <Card className="glass border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-3 hover:bg-white/50"
            onClick={() => setShowDialog('security')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-900" />
              </div>
              <p className="font-medium text-gray-900 text-sm">Security & Privacy</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-3 hover:bg-white/50"
            onClick={() => setShowDialog('notifications')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-900" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Notifications</p>
                <p className="text-xs text-gray-500">{notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-3 hover:bg-white/50"
            onClick={() => setShowDialog('payment')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-900" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Payment Methods</p>
                <p className="text-xs text-gray-500">Manage cards & accounts</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Button>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-3 hover:bg-white/50"
            onClick={() => setShowDialog('accessibility')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-900" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Accessibility</p>
                <p className="text-xs text-gray-500">{accessibilityEnabled ? 'Audio enabled' : 'Default'}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-3 hover:bg-white/50"
            onClick={() => setShowDialog('autosave')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-900" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Auto-Save</p>
                <p className="text-xs text-gray-500">{autoSaveEnabled ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Button>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button 
        className="w-full h-12 gap-2 bg-gradient-to-r from-blue-900 to-teal-600 hover:from-slate-900 hover:to-teal-700 text-white font-semibold"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </Button>

      {/* App Version */}
      <div className="text-center text-xs text-teal-600 font-medium pb-4">
        Perspective Smart Finance AI v1.0.0
      </div>

      {/* Settings Dialogs */}
      <Dialog open={showDialog !== null} onOpenChange={() => setShowDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className={(showDialog === 'accessibility' || showDialog === 'autosave') ? 'text-teal-600' : ''}>
              {showDialog === 'accessibility' && 'Accessibility'}
              {showDialog === 'notifications' && 'Notifications'}
              {showDialog === 'autosave' && 'Auto-Save Settings'}
              {showDialog === 'security' && 'Security & Privacy'}
              {showDialog === 'payment' && 'Payment Methods'}
            </DialogTitle>
          </DialogHeader>
          {showDialog && settingsDialogs[showDialog as keyof typeof settingsDialogs]}
        </DialogContent>
      </Dialog>
    </div>
    </div>
    </AuthGuard>
  )
}
