import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import { SendHorizonal, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { FileAttachment } from '@/components/chat/FileAttachment'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import type { AgentType, Message, Agent } from '@/types'

const agents: Record<AgentType, Agent> = {
  captacao: {
    id: 'captacao',
    name: 'Agente de Captação',
    title: 'Chat com Agente de Captação',
    description:
      'Crie campanhas inteligentes via WhatsApp com base na inteligência Nilo.',
    welcomeMessage:
      'Olá! Sou o Agente de Captação da Nilo. Como posso te ajudar a criar uma campanha de engajamento eficaz hoje? Você pode começar me dizendo qual o objetivo da sua campanha ou anexando um documento de referência.',
  },
  diretrizes: {
    id: 'diretrizes',
    name: 'Agente de Diretrizes',
    title: 'Chat com Agente de Diretrizes',
    description:
      'Crie protocolos e linhas de cuidado com base nas melhores práticas da Nilo.',
    welcomeMessage:
      'Olá! Eu sou o Agente de Diretrizes da Nilo. Estou aqui para ajudar a construir protocolos e linhas de cuidado. Qual jornada assistencial você gostaria de criar? Sinta-se à vontade para anexar um protocolo existente.',
  },
}

const ChatPage = () => {
  const { agentType } = useParams<{
    agentType: AgentType
  }>()

  const agent = agentType ? agents[agentType] : null

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (agent) {
      setMessages([
        {
          id: 'welcome-1',
          text: agent.welcomeMessage,
          sender: 'agent',
          timestamp: Date.now(),
        },
      ])
    }
  }, [agent])

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.children[1] as HTMLDivElement
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: 'smooth',
        })
      }
    }
  }, [messages, isLoading])

  const processAndSendMessage = (userMessage: Message) => {
    if (!agent) return

    setIsLoading(true)
    setMessages((prev) => [...prev, userMessage])

    setTimeout(() => {
      const agentResponse: Message = {
        id: `agent-${Date.now()}`,
        text: `Esta é uma resposta simulada para a sua mensagem. Em um ambiente real, eu me conectaria à API da OpenAI para gerar uma resposta inteligente.`,
        sender: 'agent',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, agentResponse])
      setIsLoading(false)
    }, 2000)
  }

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() === '' || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    }
    setInput('')
    processAndSendMessage(userMessage)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !agent) return

    const MAX_SIZE_MB = 25
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE_BYTES) {
        toast({
          variant: 'destructive',
          title: 'Arquivo muito grande',
          description: `O arquivo "${file.name}" excede o limite de ${MAX_SIZE_MB}MB.`,
        })
        continue
      }

      const userMessage: Message = {
        id: `user-${Date.now()}-${file.name}`,
        sender: 'user',
        timestamp: Date.now(),
        attachment: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: '#',
          previewUrl: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
        },
      }
      processAndSendMessage(userMessage)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!agent) {
    return <div>Agente não encontrado.</div>
  }

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-card overflow-hidden h-full">
      <header className="p-4 border-b border-nilo-border-gray flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-xl font-bold text-nilo-petroleum-blue">
            {agent.name}
          </h1>
        </div>
      </header>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-end gap-2 animate-slide-up-fade',
                msg.sender === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              <div
                className={cn(
                  'max-w-md p-3 rounded-2xl',
                  msg.sender === 'user'
                    ? 'bg-nilo-light-blue text-white rounded-br-none'
                    : 'bg-gray-100 text-nilo-dark-gray rounded-bl-none',
                )}
              >
                {msg.attachment && (
                  <FileAttachment {...msg.attachment} sender={msg.sender} />
                )}
                {msg.text && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
        </div>
        <ScrollBar />
      </ScrollArea>
      <div className="p-4 border-t border-nilo-border-gray bg-white">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 md:gap-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 md:w-12 md:h-12 flex-shrink-0 text-nilo-dark-gray hover:text-nilo-light-blue"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            aria-label="Anexar arquivo"
          >
            <Paperclip className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem ou anexe um arquivo..."
            className="flex-grow resize-none rounded-full py-3 px-5 focus-visible:ring-1 focus-visible:ring-nilo-light-blue"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full w-10 h-10 md:w-12 md:h-12 flex-shrink-0"
            disabled={isLoading || input.trim() === ''}
          >
            <SendHorizonal className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </form>
        <p className="text-xs text-center text-nilo-dark-gray/70 mt-2">
          Tamanho máximo por arquivo: 25MB.
        </p>
      </div>
    </div>
  )
}

export default ChatPage
