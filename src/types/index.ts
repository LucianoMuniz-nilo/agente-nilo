export type AgentType = 'captacao' | 'diretrizes'

export interface Attachment {
  name: string
  type: string
  size: number
  url: string
  previewUrl?: string
}

export interface Message {
  id: string
  text?: string
  sender: 'user' | 'agent'
  timestamp: number
  attachment?: Attachment
  isError?: boolean
}

export interface Agent {
  id: AgentType
  name: string
  title: string
  description: string
  welcomeMessage: string
}

export interface Conversation {
  id: string
  agentType: AgentType
  title: string
  messages: Message[]
  createdAt: number
  lastUpdatedAt: number
}
