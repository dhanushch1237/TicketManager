import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '../types'
import { apiClient } from '../lib/api'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      console.log('🔍 Checking user authentication...')
      
      // Check if we have a token first
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.log('❌ No token found')
        setUser(null)
        setLoading(false)
        return
      }
      
      console.log('🔑 Token found, validating...')
      const response = await apiClient.getProfile()
      console.log('✅ User authenticated:', response.user)
      setUser(response.user)
    } catch (error) {
      console.log('❌ Auth check failed:', error)
      apiClient.clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email)
      const response = await apiClient.login(email, password)
      console.log('✅ Login successful:', response.user)
      setUser(response.user)
      toast.success(`Welcome back, ${response.user.name}!`)
    } catch (error) {
      console.error('❌ Login failed:', error)
      let message = 'Login failed'
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid email or password')) {
          message = 'Invalid email or password. Please check your credentials.'
        } else if (error.message.includes('connect')) {
          message = 'Unable to connect to server. Please try again later.'
        } else {
          message = error.message
        }
      }
      
      toast.error(message)
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      console.log('📝 Attempting signup for:', email)
      const response = await apiClient.register(email, password, name)
      console.log('✅ Signup successful:', response.user)
      setUser(response.user)
      toast.success(`Welcome to TicketHub, ${response.user.name}!`)
    } catch (error) {
      console.error('❌ Signup failed:', error)
      let message = 'Signup failed'
      
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          message = 'An account with this email already exists. Please try logging in instead.'
        } else if (error.message.includes('connect')) {
          message = 'Unable to connect to server. Please try again later.'
        } else {
          message = error.message
        }
      }
      
      toast.error(message)
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log('🚪 Logging out user')
      await apiClient.logout()
      setUser(null)
      toast.success('Successfully logged out!')
    } catch (error) {
      console.error('❌ Logout error:', error)
      // Still clear user state even if API call fails
      setUser(null)
      toast.error('Error logging out')
    }
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}