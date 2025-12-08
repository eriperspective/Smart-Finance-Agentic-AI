// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// API Endpoints
export const API_ENDPOINTS = {
  health: `${API_URL}/health`,
  chatStream: `${API_URL}/api/chat/stream`,
  chat: `${API_URL}/api/chat`,
}

