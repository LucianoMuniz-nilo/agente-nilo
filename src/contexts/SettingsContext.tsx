import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react'
import { useToast } from '@/hooks/use-toast'

interface Settings {
  apiKey: string
  captacaoAgentId: string
  diretrizesAgentId: string
}

interface SettingsContextType {
  settings: Settings
  saveSettings: (newSettings: Partial<Settings>) => void
}

const defaultSettings: Settings = {
  apiKey: '',
  captacaoAgentId: '',
  diretrizesAgentId: '',
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = localStorage.getItem('nilo-openai-settings')
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings
    } catch (error) {
      console.error('Failed to parse settings from localStorage', error)
      return defaultSettings
    }
  })
  const { toast } = useToast()

  useEffect(() => {
    try {
      localStorage.setItem('nilo-openai-settings', JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings to localStorage', error)
    }
  }, [settings])

  const saveSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }))
    toast({
      title: 'Configurações salvas',
      description: 'Suas configurações foram atualizadas com sucesso.',
    })
  }

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
