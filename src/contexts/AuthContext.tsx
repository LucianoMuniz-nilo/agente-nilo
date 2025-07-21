import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, pass: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nilo-auth-token') === 'true'
  })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('nilo-auth-token')
    if (token === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const login = (email: string, pass: string): boolean => {
    if (email === 'lmuniz@nilo.co' && pass === '#Nilo2025') {
      localStorage.setItem('nilo-auth-token', 'true')
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('nilo-auth-token')
    setIsAuthenticated(false)
    navigate('/admin/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
