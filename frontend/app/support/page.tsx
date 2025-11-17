'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Send, Bot, User, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AuthGuard } from '@/components/AuthGuard'

interface Message {
  role: 'user' | 'assistant'
  content: string
  agent?: string
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your SmartFinance AI assistant. How can I help you today? I can assist with billing questions, technical issues, or policy information.',
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null)
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [sessionId] = useState(() => `session-${Date.now()}`)

  // Load accessibility settings from profile and check backend connection
  useEffect(() => {
    const storedAccessibility = localStorage.getItem('accessibilitySettings')
    if (storedAccessibility) {
      const settings = JSON.parse(storedAccessibility)
      setAudioEnabled(settings.audioEnabled || false)
      setHighContrast(settings.highContrast || false)
      setFontSize(settings.fontSize || 'normal')
    }
    
    // Load voices for speech synthesis (needed for voice selection)
    if ('speechSynthesis' in window) {
      // Load voices - some browsers need this
      window.speechSynthesis.getVoices()
      // Reload voices when they change (happens on some browsers)
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices()
      }
    }
    
    // Initial backend connection check
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/health', {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        })
        setBackendConnected(response.ok)
      } catch (error) {
        setBackendConnected(false)
      }
    }
    
    checkBackend()
    // Recheck periodically (but not too aggressively)
    const interval = setInterval(checkBackend, 90000) // Every 90 seconds
    return () => clearInterval(interval)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Auto-scroll disabled - page stays at top for better UX
  // useEffect(() => {
  //   scrollToBottom()
  // }, [messages])

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Always cancel any ongoing speech first
      window.speechSynthesis.cancel()
      
      // Only speak if audio is enabled
      if (audioEnabled) {
        // Clean text: remove emojis and special formatting for better speech
        const cleanText = text
          .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
          .replace(/[•◦▪▫]/g, '') // Remove bullet points
          .replace(/\*\*/g, '') // Remove bold markdown
          .replace(/\n\n+/g, '. ') // Replace double newlines with period
          .replace(/\n/g, ', ') // Replace single newlines with comma
          .trim()
        
        const utterance = new SpeechSynthesisUtterance(cleanText)
        
        // Get available voices and select the best female voice
        const voices = window.speechSynthesis.getVoices()
        
        // Priority order for natural-sounding female voices
        const preferredVoices = [
          'Microsoft Zira - English (United States)',
          'Samantha',
          'Microsoft Aria Online (Natural) - English (United States)',
          'Google US English',
          'Google UK English Female',
          'Victoria',
          'Karen',
          'Moira'
        ]
        
        let selectedVoice = null
        
        // Try to find preferred voices first
        for (const preferred of preferredVoices) {
          selectedVoice = voices.find(voice => voice.name.includes(preferred))
          if (selectedVoice) break
        }
        
        // Fallback: find any female voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
          voice.name.includes('Zira') ||
            voice.name.includes('Samantha')
          )
        }
        
        // Last fallback: any English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.includes('en-US'))
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
        
        // Optimized settings for more natural speech
        utterance.rate = 0.9   // Slower, more deliberate pace
        utterance.pitch = 1.05  // Slightly elevated, natural feminine tone
        utterance.volume = 0.9  // Slightly softer for comfort
        
        // Add pause between sentences for better comprehension
        utterance.lang = 'en-US'
        
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
    }

    const currentInput = inputMessage
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Get real user data from localStorage or use defaults
      const storedUserData = localStorage.getItem('userData')
      const userData = storedUserData ? JSON.parse(storedUserData) : {
        totalBalance: 1440000.00,
        savedThisMonth: 2800.00,
        savingsGoal: 5000.00,
        rewardsPoints: 88000
      }
      
      // Build user context for personalized AI responses
      const userContext = `
CURRENT USER FINANCIAL PROFILE:
• Account Balance: $${userData.totalBalance.toLocaleString()} (${userData.balanceChange || 12}% this month)
• Monthly Savings Goal: $${userData.savedThisMonth.toLocaleString()} of $${userData.savingsGoal.toLocaleString()} (${Math.round((userData.savedThisMonth / userData.savingsGoal) * 100)}% complete)
• Rewards: ${userData.rewardsPoints.toLocaleString()} points (${userData.rewardsPoints >= 50000 ? 'Platinum' : userData.rewardsPoints >= 25000 ? 'Gold' : 'Silver'} Tier)
• Active Goals: User has active savings goals
• Premium Features: Full access enabled
`
      
      // Try to use backend first with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout for AI processing (GPT-4 can be slow)
      
      const response = await fetch('http://localhost:8000/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          session_id: sessionId,
          user_context: userContext,
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('Backend not available')
      }

      // Update backend connection status on successful response
      setBackendConnected(true)

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''
      let agentUsed = ''
      let streamComplete = false
      let buffer = '' // Accumulate incomplete chunks

      if (reader) {
        try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

            // Decode and add to buffer
            buffer += decoder.decode(value, { stream: true })
            
            // Split by newlines but keep the last incomplete line in the buffer
            const lines = buffer.split('\n')
            buffer = lines.pop() || '' // Keep the last (possibly incomplete) line in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                  let jsonStr = line.slice(6).trim()
                  // Handle double "data: " prefix if present
                  if (jsonStr.startsWith('data: ')) {
                    jsonStr = jsonStr.slice(6).trim()
                  }
                  if (!jsonStr) continue // Skip empty lines
                  
                  const data = JSON.parse(jsonStr)
                
                if (data.error) {
                  throw new Error(data.error)
                }

                if (data.content) {
                  assistantMessage += data.content
                  agentUsed = data.agent || agentUsed
                  
                  // Update the message in real-time
                  setMessages(prev => {
                    const newMessages = [...prev]
                    const lastMessage = newMessages[newMessages.length - 1]
                    
                    if (lastMessage?.role === 'assistant') {
                      newMessages[newMessages.length - 1] = {
                        role: 'assistant',
                        content: assistantMessage,
                        agent: agentUsed,
                      }
                    } else {
                      newMessages.push({
                        role: 'assistant',
                        content: assistantMessage,
                        agent: agentUsed,
                      })
                    }
                    
                    return newMessages
                  })
                }

                if (data.done) {
                    streamComplete = true
                  // Speak the complete message if audio is enabled
                  if (audioEnabled && assistantMessage) {
                    speakText(assistantMessage)
                  }
                  break
                }
              } catch (e) {
                  // Silently ignore incomplete chunks - they'll complete in next iteration
                  if (line.trim().endsWith('}')) {
                    console.error('Error parsing complete SSE line:', e, 'Line:', line)
                  }
                }
              }
            }
            
            // Break out of while loop when stream is complete
            if (streamComplete) break
          }

          // Process any remaining data in the buffer after stream ends
          if (buffer.trim()) {
            const line = buffer.trim()
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.slice(6).trim()
                if (jsonStr) {
                  const data = JSON.parse(jsonStr)
                  if (data.content) {
                    assistantMessage += data.content
                    agentUsed = data.agent || agentUsed
                    
                    setMessages(prev => {
                      const newMessages = [...prev]
                      const lastMessage = newMessages[newMessages.length - 1]
                      
                      if (lastMessage?.role === 'assistant') {
                        newMessages[newMessages.length - 1] = {
                          role: 'assistant',
                          content: assistantMessage,
                          agent: agentUsed,
                        }
                      } else {
                        newMessages.push({
                          role: 'assistant',
                          content: assistantMessage,
                          agent: agentUsed,
                        })
                      }
                      
                      return newMessages
                    })
                  }
                  if (data.done && audioEnabled && assistantMessage) {
                    speakText(assistantMessage)
                  }
                }
              } catch (e) {
                console.error('Error parsing final buffer:', e, 'Buffer:', line)
              }
            }
          }
        } finally {
          // CRITICAL: Always release the reader to close the connection
          reader.releaseLock()
        }
      }
    } catch (error) {
      console.error('Error communicating with backend:', error)
      // Update backend connection status
      setBackendConnected(false)
      
      // Show clear error message - NO fallback responses
      const errorMsg = error instanceof Error ? error.message : String(error)
      const isTimeout = errorMsg.includes('aborted') || errorMsg.includes('timeout')
      const isNetworkError = errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')
      
      let helpfulMessage = `❌ **Unable to connect to AI Backend**\n\n`
      
      if (isTimeout) {
        helpfulMessage += `**Issue:** The AI request timed out (took longer than 60 seconds).\n\n**Solutions:**\n• The AI might be processing - please try again\n• Simplify your question for faster processing\n• Check backend terminal for OpenAI API errors`
      } else if (isNetworkError) {
        helpfulMessage += `**Issue:** Cannot reach the backend server.\n\n**Solutions:**\n• Ensure backend is running: http://localhost:8000\n• Check the backend terminal for errors\n• Restart backend if needed`
      } else {
        helpfulMessage += `**Error:** ${errorMsg}\n\n**Solutions:**\n• Check backend is running: http://localhost:8000\n• Verify OpenAI API key is set in backend/.env\n• Review backend terminal for detailed errors`
      }
      
      helpfulMessage += `\n\n**Quick Fix:**\nRestart backend: \`cd backend && .\\venv\\Scripts\\activate && python -m uvicorn app.main:app --reload\``
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: helpfulMessage,
        agent: 'error',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+/ or Cmd+/ to toggle audio
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        const newAudioState = !audioEnabled
        setAudioEnabled(newAudioState)
        saveAccessibilitySettings({ audioEnabled: newAudioState })
        if (newAudioState) {
          speakText('Audio assistance enabled')
        } else if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel()
        }
      }
      // Escape to cancel ongoing speech
      if (e.key === 'Escape' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [audioEnabled])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getAgentBadge = (agent?: string) => {
    if (!agent) return null

    const agentColors: Record<string, string> = highContrast 
      ? {
          billing_agent: 'bg-blue-600 text-white border-2 border-blue-800',
          technical_agent: 'bg-purple-600 text-white border-2 border-purple-800',
          policy_agent: 'bg-green-600 text-white border-2 border-green-800',
        }
      : {
          billing_agent: 'bg-blue-100 text-blue-700',
          technical_agent: 'bg-purple-100 text-purple-700',
          policy_agent: 'bg-green-100 text-green-700',
        }

    const agentNames: Record<string, string> = {
      billing_agent: 'Billing',
      technical_agent: 'Technical',
      policy_agent: 'Policy',
    }

    return (
      <span className={cn('text-xs px-2 py-1 rounded-full font-medium', agentColors[agent])}>
        {agentNames[agent] || agent}
      </span>
    )
  }

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large': return 'text-base'
      case 'xlarge': return 'text-lg'
      default: return 'text-sm'
    }
  }

  const saveAccessibilitySettings = (settings: any) => {
    const storedAccessibility = localStorage.getItem('accessibilitySettings')
    const currentSettings = storedAccessibility ? JSON.parse(storedAccessibility) : {}
    const newSettings = { ...currentSettings, ...settings }
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings))
  }

  const quickQuestions = [
    'What are your account fees?',
    'How do I reset my password?',
    'What is your fraud policy?',
    'How do I dispute a transaction?',
  ]

  return (
    <AuthGuard>
    <div className="min-h-screen relative overflow-auto bg-gradient-to-br from-teal-600 via-blue-900 to-slate-900">
      {/* Decorative Spheres */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400/60 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/50 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/3"></div>
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-cyan-400/60 rounded-full blur-[120px] translate-x-1/3"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-500/50 rounded-full blur-[100px]"></div>
      
    <div className="container mx-auto p-4 max-w-md h-screen flex flex-col pb-24 relative z-10">
      {/* Header */}
      <div 
        className="bg-white rounded-3xl p-4 shadow-xl mb-4"
        role="region"
        aria-label="Chat controls and settings"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-teal-600 flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">AI Support</h1>
                {backendConnected !== null && (
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    backendConnected ? "bg-green-500" : "bg-yellow-500"
                  )} title={backendConnected ? "Backend connected - Full AI active" : "Local mode - Using fallback AI"} />
                )}
              </div>
              <p className="text-xs text-gray-600">
                {backendConnected === true && "Full Agentic AI Active"}
                {backendConnected === false && "Local AI Mode"}
                {backendConnected === null && "Checking connection..."}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const newAudioState = !audioEnabled
                
                // If turning OFF audio, cancel any ongoing speech
                if (!newAudioState && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel()
                }
                
                setAudioEnabled(newAudioState)
                saveAccessibilitySettings({ audioEnabled: newAudioState })
                
                // If turning ON audio, announce it
                if (newAudioState) {
                  speakText('Audio assistance enabled')
                }
              }}
              className="rounded-full"
              aria-label="Toggle audio assistance"
              title={audioEnabled ? "Mute audio (click to turn off)" : "Unmute audio (click to turn on)"}
            >
              {audioEnabled ? (
                <Volume2 className="w-5 h-5 text-green-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const nextSize = fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xlarge' : 'normal'
                setFontSize(nextSize)
                saveAccessibilitySettings({ fontSize: nextSize })
              }}
              className="text-xs font-bold"
              aria-label="Change font size"
              title="Text Size (A-/A/A+)"
            >
              {fontSize === 'normal' && 'A'}
              {fontSize === 'large' && 'A+'}
              {fontSize === 'xlarge' && 'A++'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newContrast = !highContrast
                setHighContrast(newContrast)
                saveAccessibilitySettings({ highContrast: newContrast })
              }}
              className={cn(
                "text-xs font-bold border",
                highContrast ? "bg-black text-white border-white" : "bg-white text-black border-black"
              )}
              aria-label="Toggle high contrast mode"
              title="High Contrast Mode (for visual clarity)"
            >
              {highContrast ? 'HC' : 'HC'}
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto space-y-4 mb-4"
        role="log"
        aria-live="polite"
        aria-label="Chat conversation"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
            role="article"
            aria-label={message.role === 'user' ? 'Your message' : 'AI assistant message'}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div className={cn(
              'max-w-[80%] rounded-2xl p-4 shadow-md',
              message.role === 'user' 
                ? highContrast 
                  ? 'bg-blue-700 text-white border-2 border-blue-900'
                  : 'bg-gradient-to-br from-blue-900 to-teal-600 text-white'
                : highContrast
                  ? 'bg-white text-black border-2 border-black'
                  : 'gradient-mixed text-white'
            )}>
              {message.role === 'assistant' && message.agent && (
                <div className="mb-2">
                  {getAgentBadge(message.agent)}
                </div>
              )}
              <p className={cn(
                'whitespace-pre-wrap font-medium',
                getFontSizeClass(),
                message.role === 'user' 
                  ? 'text-white' 
                  : highContrast ? 'text-black' : 'text-white'
              )}>
                {message.content}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="gradient-mixed rounded-2xl p-4 shadow-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions (only show when conversation is fresh) */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <p className="text-xs text-teal-200 mb-2 font-medium">Quick questions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (isLoading) return
                  
                  const userMessage: Message = {
                    role: 'user',
                    content: question,
                  }

                  setMessages(prev => [...prev, userMessage])
                  setInputMessage('')
                  setIsLoading(true)

                  try {
                    // Try backend with timeout
                    const controller = new AbortController()
                    const timeoutId = setTimeout(() => controller.abort(), 30000)
                    
                    const response = await fetch('http://localhost:8000/api/chat/stream', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ message: question, session_id: sessionId }),
                      signal: controller.signal
                    })

                    clearTimeout(timeoutId)

                    if (!response.ok) throw new Error('Backend not available')

                    setBackendConnected(true)

                    const reader = response.body?.getReader()
                    const decoder = new TextDecoder()
                    let assistantMessage = ''
                    let agentUsed = ''
                    let buffer = '' // Buffer for incomplete chunks

                    if (reader) {
                      while (true) {
                        const { done, value } = await reader.read()
                        if (done) break
                        
                        // Decode and add to buffer
                        buffer += decoder.decode(value, { stream: true })
                        
                        // Split by newlines but keep the last incomplete line in buffer
                        const lines = buffer.split('\n')
                        buffer = lines.pop() || ''
                        
                        for (const line of lines) {
                          if (line.startsWith('data: ')) {
                            try {
                              let jsonStr = line.slice(6).trim()
                              // Handle double "data: " prefix if present
                              if (jsonStr.startsWith('data: ')) {
                                jsonStr = jsonStr.slice(6).trim()
                              }
                              if (!jsonStr) continue
                              
                              const data = JSON.parse(jsonStr)
                              if (data.error) throw new Error(data.error)
                              if (data.content) {
                                assistantMessage += data.content
                                agentUsed = data.agent || agentUsed
                                setMessages(prev => {
                                  const newMessages = [...prev]
                                  const lastMessage = newMessages[newMessages.length - 1]
                                  if (lastMessage?.role === 'assistant') {
                                    newMessages[newMessages.length - 1] = {
                                      role: 'assistant',
                                      content: assistantMessage,
                                      agent: agentUsed,
                                    }
                                  } else {
                                    newMessages.push({
                                      role: 'assistant',
                                      content: assistantMessage,
                                      agent: agentUsed,
                                    })
                                  }
                                  return newMessages
                                })
                              }
                              if (data.done) {
                                if (audioEnabled && assistantMessage) speakText(assistantMessage)
                                break
                              }
                            } catch (e) {
                              // Silently ignore incomplete chunks
                              if (line.trim().endsWith('}')) {
                              console.error('Error parsing SSE data:', e)
                              }
                            }
                          }
                        }
                      }
                    }
                  } catch (error) {
                    console.error('Error with quick question:', error)
                    setBackendConnected(false)
                    
                    // Show clear error message
                    const errorMsg = error instanceof Error ? error.message : String(error)
                    setMessages(prev => [...prev, {
                      role: 'assistant',
                      content: `❌ **AI Backend Connection Failed**\n\n**Error:** ${errorMsg}\n\n**Please check:**\n• Backend server is running at http://localhost:8000\n• OpenAI API key is configured in backend/.env\n• Review backend terminal for errors`,
                      agent: 'error',
                    }])
                  } finally {
                    setIsLoading(false)
                  }
                }}
                className="text-xs h-auto py-2 px-3 text-left justify-start bg-gradient-to-br from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white border-0 shadow-md"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className={cn(
        "rounded-2xl p-3 shadow-xl border",
        highContrast 
          ? "bg-white border-black border-2"
          : "bg-white border-gray-200"
      )}>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Press Enter to send)"
            className={cn(
              "flex-1 bg-transparent border-none outline-none placeholder-gray-400 font-medium",
              getFontSizeClass(),
              highContrast ? "text-black placeholder-gray-700" : "text-gray-900"
            )}
            disabled={isLoading}
            aria-label="Message input - Press Enter to send"
            autoComplete="off"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
            className={cn(
              "rounded-full shadow-lg transition-all",
              highContrast
                ? "bg-black text-white hover:bg-gray-800 border-2 border-white"
                : "bg-gradient-to-r from-blue-900 to-teal-600 hover:from-slate-900 hover:to-teal-700"
            )}
            aria-label="Send message (Ctrl+Enter)"
            title="Send (Ctrl+Enter)"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
        {isLoading && (
          <div className={cn(
            "mt-2 text-xs flex items-center gap-2",
            highContrast ? "text-black font-bold" : "text-gray-600"
          )} role="status" aria-live="polite">
            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
            AI is typing response...
          </div>
        )}
      </div>
      </div>
    </div>
    </AuthGuard>
  )
}

