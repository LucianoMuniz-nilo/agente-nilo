import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import { Conversation, Message, AgentType } from '@/types'

interface ConversationContextType {
  conversations: Conversation[]
  getConversationsByAgent: (agentType: AgentType) => Conversation[]
  getConversation: (id: string) => Conversation | undefined
  addMessageToConversation: (conversationId: string, message: Message) => void
  createConversation: (
    agentType: AgentType,
    initialMessages: Message[],
  ) => Conversation
  deleteConversation: (id: string) => void
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined,
)

const generateTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find((m) => m.sender === 'user')?.text
  if (firstUserMessage) {
    const title = firstUserMessage.split(' ').slice(0, 5).join(' ')
    return title.length < firstUserMessage.length ? `${title}...` : title
  }
  return 'Nova Conversa'
}

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    try {
      const storedConversations = localStorage.getItem('nilo-conversations')
      if (storedConversations) {
        setConversations(JSON.parse(storedConversations))
      }
    } catch (error) {
      console.error('Failed to load conversations from localStorage', error)
      setConversations([])
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('nilo-conversations', JSON.stringify(conversations))
    } catch (error) {
      console.error('Failed to save conversations to localStorage', error)
    }
  }, [conversations])

  const getConversationsByAgent = useCallback(
    (agentType: AgentType) => {
      return conversations
        .filter((c) => c.agentType === agentType)
        .sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt)
    },
    [conversations],
  )

  const getConversation = useCallback(
    (id: string) => {
      return conversations.find((c) => c.id === id)
    },
    [conversations],
  )

  const createConversation = useCallback(
    (agentType: AgentType, initialMessages: Message[]): Conversation => {
      const now = Date.now()
      const newConversation: Conversation = {
        id: `conv-${now}`,
        agentType,
        messages: initialMessages,
        title: generateTitle(initialMessages),
        createdAt: now,
        lastUpdatedAt: now,
      }
      setConversations((prev) => [newConversation, ...prev])
      return newConversation
    },
    [],
  )

  const addMessageToConversation = useCallback(
    (conversationId: string, message: Message) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            const updatedMessages = [...conv.messages, message]
            return {
              ...conv,
              messages: updatedMessages,
              title:
                conv.title === 'Nova Conversa'
                  ? generateTitle(updatedMessages)
                  : conv.title,
              lastUpdatedAt: Date.now(),
            }
          }
          return conv
        }),
      )
    },
    [],
  )

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
  }, [])

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        getConversationsByAgent,
        getConversation,
        addMessageToConversation,
        createConversation,
        deleteConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}

export const useConversations = () => {
  const context = useContext(ConversationContext)
  if (context === undefined) {
    throw new Error(
      'useConversations must be used within a ConversationProvider',
    )
  }
  return context
}
