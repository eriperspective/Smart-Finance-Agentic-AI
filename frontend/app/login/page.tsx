'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Hash } from 'lucide-react'

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'pin'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [isCreateAccountHovered, setIsCreateAccountHovered] = useState(false)
  const router = useRouter()
  const { login, loginWithPin } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      let success = false
      
      if (loginMethod === 'email') {
        success = await login(email, password)
      } else {
        success = await loginWithPin(pin)
      }
      
      if (success) {
        router.push('/')
      } else {
        if (loginMethod === 'email') {
          setError('Invalid credentials. Please try again.')
        } else {
          setError('Invalid PIN. Please enter a 4-6 digit PIN.')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Responsive Styles */
        @media (max-width: 640px) {
          .login-card {
            padding: 1.5rem !important;
            border-radius: 12px !important;
          }
          .welcome-heading {
            font-size: 1.375rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .login-card {
            padding: 1.25rem !important;
          }
          .welcome-heading {
            font-size: 1.125rem !important;
          }
        }
        
        @media (max-width: 360px) {
          .login-card {
            padding: 1rem !important;
          }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 30%, #1E3A8A 70%, #1E293B 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Playfair Display', serif",
        padding: "1.5rem 1rem"
      }}>
        {/* Animated Background Spheres - More Pronounced Teal */}
        {/* Large Teal Sphere - Top Right */}
        <div style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          backgroundColor: "rgba(20, 184, 166, 0.3)",
          filter: "blur(80px)",
          animation: "float 20s ease-in-out infinite"
        }}></div>
        
        {/* Dark Blue Sphere - Bottom Left */}
        <div style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          backgroundColor: "rgba(30, 58, 138, 0.2)",
          filter: "blur(80px)",
          animation: "float 25s ease-in-out infinite 2s"
        }}></div>

        {/* Bright Teal Sphere - Bottom Right */}
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "-80px",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          backgroundColor: "rgba(45, 212, 191, 0.25)",
          filter: "blur(70px)",
          animation: "float 22s ease-in-out infinite 1s"
        }}></div>

        {/* Medium Dark Blue Sphere - Top Left */}
        <div style={{
          position: "absolute",
          top: "5%",
          left: "-120px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          backgroundColor: "rgba(30, 64, 175, 0.15)",
          filter: "blur(70px)",
          animation: "float 28s ease-in-out infinite 3s"
        }}></div>

        {/* Large Teal Sphere - Center Right */}
        <div style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          backgroundColor: "rgba(20, 184, 166, 0.2)",
          filter: "blur(60px)",
          animation: "float 26s ease-in-out infinite 1.5s"
        }}></div>

        {/* Teal Sphere - Center Left */}
        <div style={{
          position: "absolute",
          bottom: "25%",
          left: "5%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          backgroundColor: "rgba(13, 211, 195, 0.2)",
          filter: "blur(65px)",
          animation: "float 24s ease-in-out infinite 2.5s"
        }}></div>

        {/* Logo/Branding Above Card */}
        <div style={{
          textAlign: "center",
          marginBottom: "2rem",
          animation: "slideInUp 0.6s ease-out",
          position: "relative",
          zIndex: 10
        }}>
          {/* Teal to Dark Navy Blue Gradient Circle */}
          <div style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 1rem auto",
            background: "linear-gradient(135deg, #2DD4BF 0%, #14B8A6 35%, #1E3A8A 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "bounce 2s ease-in-out infinite",
            boxShadow: "0 10px 40px rgba(45, 212, 191, 0.6)"
          }}></div>
          
          <h1 style={{
            color: "white",
            marginBottom: "0.5rem",
            letterSpacing: "0px",
            fontWeight: "400",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: "0.5rem"
          }}>
            <span style={{
              fontFamily: "var(--font-dancing-script)",
              fontWeight: "400",
              fontStyle: "normal",
              letterSpacing: "0px",
              fontSize: "3rem"
            }}>Perspective</span>
            <span style={{
              fontFamily: "var(--font-playfair-display)",
              fontWeight: "700",
              fontSize: "2.5rem"
            }}>Finance AI</span>
          </h1>
          <p style={{
            fontSize: "1rem",
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: "500",
            fontFamily: "'Playfair Display', serif"
          }}>
            Your Intelligent Financial Companion
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "415px"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem 2.5rem",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            animation: "slideInUp 0.8s ease-out 0.1s backwards"
          }}
          className="login-card"
          >
            {/* Welcome Back Header */}
            <h2 className="welcome-heading" style={{
              fontSize: "1.625rem",
              fontWeight: "700",
              color: "#1E3A8A",
              marginBottom: "0.25rem",
              textAlign: "center",
              fontFamily: "'Playfair Display', serif"
            }}>
              Welcome Back
            </h2>
            <p style={{
              fontSize: "0.875rem",
              color: "#14B8A6",
              textAlign: "center",
              marginBottom: "1.5rem",
              fontWeight: "600",
              fontFamily: "'Playfair Display', serif"
            }}>
              Log In To Your Account & Continue Planning
            </p>

            {/* Login Method Tabs */}
            <div style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.25rem",
              padding: "0.25rem",
              backgroundColor: "#F3F4F6",
              borderRadius: "10px"
            }}>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('email')
                  setError('')
                }}
                style={{
                  flex: 1,
                  padding: "0.625rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: loginMethod === 'email' ? 'white' : 'transparent',
                  color: loginMethod === 'email' ? '#14B8A6' : '#6B7280',
                  boxShadow: loginMethod === 'email' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('pin')
                  setError('')
                }}
                style={{
                  flex: 1,
                  padding: "0.625rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: loginMethod === 'pin' ? 'white' : 'transparent',
                  color: loginMethod === 'pin' ? '#14B8A6' : '#6B7280',
                  boxShadow: loginMethod === 'pin' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                <Hash size={16} />
                PIN
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: "0.875rem",
                borderRadius: "8px",
                marginBottom: "1.25rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                animation: "slideInUp 0.3s ease-out",
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                border: "1px solid #FECACA",
                fontFamily: "'Playfair Display', serif"
              }}>
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {loginMethod === 'email' ? (
                <>
                  {/* Email Input */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#1E3A8A",
                      marginBottom: "0.5rem",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                      }}
                      style={{
                        width: "100%",
                        padding: "0.875rem",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        transition: "all 0.3s ease",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#14B8A6"
                        e.target.style.boxShadow = "0 0 0 3px rgba(45, 212, 191, 0.2)"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E5E7EB"
                        e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)"
                      }}
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#1E3A8A",
                      marginBottom: "0.5rem",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      Password
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setError('')
                        }}
                        style={{
                          width: "100%",
                          padding: "0.875rem",
                          paddingRight: "3rem",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "0.875rem",
                          transition: "all 0.3s ease",
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#0F766E"
                          e.target.style.boxShadow = "0 0 0 3px rgba(15, 118, 110, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB"
                          e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)"
                        }}
                        required
                        minLength={4}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "0.75rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#9CA3AF",
                          padding: "0.25rem"
                        }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* PIN Input */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#1E3A8A",
                      marginBottom: "0.5rem",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      Enter PIN
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="••••"
                      value={pin}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        if (value.length <= 6) {
                          setPin(value)
                          setError('')
                        }
                      }}
                      style={{
                        width: "100%",
                        padding: "0.875rem",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1.5rem",
                        textAlign: "center",
                        letterSpacing: "0.5rem",
                        fontFamily: "monospace",
                        transition: "all 0.3s ease",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#14B8A6"
                        e.target.style.boxShadow = "0 0 0 3px rgba(45, 212, 191, 0.2)"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E5E7EB"
                        e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)"
                      }}
                      required
                      minLength={4}
                      maxLength={6}
                    />
                    <p style={{
                      fontSize: "0.75rem",
                      color: "#6B7280",
                      textAlign: "center",
                      marginTop: "0.5rem",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      Enter your 4-6 digit PIN
                    </p>
                  </div>
                </>
              )}

              {/* Login Button - Bright Teal */}
              <button
                type="submit"
                disabled={isLoading}
                onMouseEnter={() => !isLoading && setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  backgroundColor: isLoading ? "#14B8A6" : (isButtonHovered ? "#14B8A6" : "#2DD4BF"),
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.9375rem",
                  fontWeight: "700",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.5px",
                  boxShadow: isButtonHovered && !isLoading 
                    ? "0 6px 24px rgba(45, 212, 191, 0.6)" 
                    : "0 4px 12px rgba(45, 212, 191, 0.4)",
                  transform: isLoading ? "scale(0.98)" : (isButtonHovered ? "translateY(-2px)" : "translateY(0)"),
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            {/* Demo Credentials */}
            <div style={{
              marginTop: "1rem",
              padding: "0.75rem",
              backgroundColor: "#EFF6FF",
              borderRadius: "8px",
              border: "1px solid #DBEAFE"
            }}>
              <p style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#1E3A8A",
                marginBottom: "0.25rem",
                fontFamily: "'Playfair Display', serif"
              }}>
                Demo Credentials:
              </p>
              {loginMethod === 'email' ? (
                <p style={{
                  fontSize: "0.75rem",
                  color: "#1E40AF",
                  lineHeight: "1.4",
                  fontFamily: "'Playfair Display', serif"
                }}>
                  Email: <span style={{ fontFamily: "monospace", fontWeight: "600" }}>demo@perspective.ai</span><br/>
                  Password: <span style={{ fontFamily: "monospace", fontWeight: "600" }}>demo</span>
                </p>
              ) : (
                <p style={{
                  fontSize: "0.75rem",
                  color: "#1E40AF",
                  fontFamily: "'Playfair Display', serif"
                }}>
                  PIN: <span style={{ fontFamily: "monospace", fontWeight: "600" }}>1234</span> (or any 4-6 digit PIN)
                </p>
              )}
            </div>

            {/* Divider */}
            <div style={{
              margin: "1.25rem 0",
              display: "flex",
              alignItems: "center",
              gap: "1rem"
            }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }}></div>
              <span style={{ color: "#9CA3AF", fontSize: "0.75rem", fontFamily: "'Playfair Display', serif" }}>New Here?</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }}></div>
            </div>

            {/* Create Account Button */}
            <button
              type="button"
              onClick={() => {
                alert('Sign up feature coming soon! For now, use the demo credentials above.')
              }}
              onMouseEnter={() => setIsCreateAccountHovered(true)}
              onMouseLeave={() => setIsCreateAccountHovered(false)}
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "transparent",
                color: isCreateAccountHovered ? "#1E3A8A" : "#14B8A6",
                border: `2px solid #1E3A8A`,
                borderRadius: "8px",
                fontSize: "0.9375rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textTransform: "uppercase" as const,
                letterSpacing: "0.5px",
                fontFamily: "'Playfair Display', serif"
              }}
            >
              Create Account
            </button>
          </div>

          {/* Footer */}
          <p style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.75rem",
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: "500",
            fontFamily: "'Playfair Display', serif"
          }}>
            Protected by enterprise-grade encryption
          </p>
        </div>
      </div>
    </>
  )
}
