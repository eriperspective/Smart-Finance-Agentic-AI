'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User, Volume2, VolumeX, X, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  agent?: string
}

export function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your SmartFinance AI assistant. How can I help you today?',
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [sessionId] = useState(() => `floating-${Date.now()}`)
  const audioEnabledRef = useRef(audioEnabled) // Track audio state for immediate access

  // Check backend connection
  useEffect(() => {
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
    
    if (isOpen) {
      checkBackend()
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Keep ref in sync with state
  useEffect(() => {
    audioEnabledRef.current = audioEnabled
  }, [audioEnabled])

  const speakText = (text: string) => {
    if (!audioEnabled || !audioEnabledRef.current || !('speechSynthesis' in window)) return
    
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(voice => voice.lang.startsWith('en'))
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }
    
    window.speechSynthesis.speak(utterance)
  }

  // Removed getFallbackResponse - now using real OpenAI GPT-4 responses only!

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      if (backendConnected) {
        const response = await fetch('http://localhost:8000/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.content,
            session_id: sessionId,
            user_context: null
          }),
          signal: AbortSignal.timeout(30000)
        })

        if (!response.ok) throw new Error('Backend request failed')

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ''
        let detectedAgent = ''
        let buffer = '' // Accumulate incomplete chunks

        if (reader) {
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
                  console.log('Received data chunk:', data)
                  
                  if (data.error) {
                    console.error('Error from backend:', data.error)
                    throw new Error(data.error)
                  }

                  if (data.content) {
                    assistantMessage += data.content
                    detectedAgent = data.agent || detectedAgent
                    console.log('Assistant message length:', assistantMessage.length)
                    
                    setMessages(prev => {
                      const newMessages = [...prev]
                      if (newMessages[newMessages.length - 1]?.role === 'assistant') {
                        newMessages[newMessages.length - 1] = {
                          role: 'assistant',
                          content: assistantMessage,
                          agent: detectedAgent
                        }
                      } else {
                        newMessages.push({
                          role: 'assistant',
                          content: assistantMessage,
                          agent: detectedAgent
                        })
                      }
                      return newMessages
                    })
                  }

                  if (data.done && audioEnabled && assistantMessage) {
                    speakText(assistantMessage)
                  }
                } catch (e) {
                  // Silently ignore incomplete chunks - they'll complete in next iteration
                  if (line.trim().endsWith('}')) {
                    console.error('Error parsing SSE:', e)
                  }
                }
              }
            }
          }
        }
      } else {
        // Backend not connected - show connection error
        const errorMessage: Message = {
          role: 'assistant',
          content: '❌ Unable to connect to the AI backend. Please make sure the backend server is running on http://localhost:8000\n\nCheck your backend terminal for errors.',
          agent: 'error'
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error in sendMessage:', error)
      // Show the actual error instead of fallback
      const errorMessage: Message = {
        role: 'assistant',
        content: `❌ Error communicating with AI: ${error instanceof Error ? error.message : String(error)}\n\nPlease check:\n• Backend is running (http://localhost:8000)\n• OpenAI API key is configured\n• Check backend terminal for detailed errors`,
        agent: 'error'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getAgentBadge = (agent?: string) => {
    if (!agent || agent === 'general') return null
    
    const agentConfig: Record<string, { label: string, color: string }> = {
      billing_agent: { label: 'Billing', color: 'bg-blue-500' },
      technical_support_agent: { label: 'Technical', color: 'bg-purple-500' },
      policy_agent: { label: 'Policy', color: 'bg-green-500' }
    }

    const config = agentConfig[agent]
    if (!config) return null

    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs text-white ${config.color} ml-2`}>
        {config.label}
      </span>
    )
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full shadow-lg",
          "bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
          "flex items-center justify-center transition-all duration-300 ease-in-out",
          "hover:scale-110 active:scale-95",
          isOpen && "scale-0 opacity-0"
        )}
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Chat Dialog */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[380px] h-[550px] flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-white border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-semibold text-sm">Agentic AI Assistant</h3>
                <div className="flex items-center gap-1 text-xs opacity-90">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    backendConnected ? "bg-green-400" : "bg-yellow-400"
                  )} />
                  <span>{backendConnected ? "Connected" : "Local Mode"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newAudioState = !audioEnabled
                  
                  // ALWAYS stop any ongoing speech immediately and forcefully
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel()
                    window.speechSynthesis.pause()
                    // Clear the queue completely with multiple attempts
                    setTimeout(() => window.speechSynthesis.cancel(), 10)
                    setTimeout(() => window.speechSynthesis.cancel(), 50)
                  }
                  
                  // Update ref immediately for instant effect
                  audioEnabledRef.current = newAudioState
                  setAudioEnabled(newAudioState)
                  
                  // If turning ON audio, announce it (with delay to ensure cancel completed)
                  if (newAudioState) {
                    setTimeout(() => {
                      if (audioEnabledRef.current) {
                        speakText('Audio enabled')
                      }
                    }, 200)
                  }
                }}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                aria-label={audioEnabled ? "Click to STOP audio and mute" : "Click to enable audio"}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                    message.role === 'user'
                      ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  {message.agent && getAgentBadge(message.agent)}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className={cn(
                  "w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600",
                  "flex items-center justify-center transition-all",
                  "hover:shadow-lg hover:scale-105 active:scale-95",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                )}
                aria-label="Send message"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

