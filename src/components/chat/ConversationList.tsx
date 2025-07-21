import { Link, useNavigate, useParams } from 'react-router-dom'
import { MessageSquareText, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useConversations } from '@/contexts/ConversationContext'
import { AgentType } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ConversationListProps {
  onConversationSelect?: () => void
}

export const ConversationList = ({
  onConversationSelect,
}: ConversationListProps) => {
  const { agentType, conversationId } = useParams<{
    agentType: AgentType
    conversationId?: string
  }>()
  const navigate = useNavigate()
  const { getConversationsByAgent, deleteConversation } = useConversations()

  if (!agentType) return null

  const conversations = getConversationsByAgent(agentType)

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    deleteConversation(id)
    if (id === conversationId) {
      navigate(`/chat/${agentType}`)
    }
  }

  const handleSelect = () => {
    if (onConversationSelect) {
      onConversationSelect()
    }
  }

  return (
    <div className="p-2 space-y-1">
      {conversations.length > 0 ? (
        conversations.map((conv) => (
          <Tooltip key={conv.id} delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={conv.id === conversationId ? 'secondary' : 'ghost'}
                className="w-full justify-start group h-auto py-2 px-3"
                onClick={handleSelect}
              >
                <Link
                  to={`/chat/${agentType}/${conv.id}`}
                  className="flex items-center w-full gap-3"
                >
                  <MessageSquareText className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 truncate text-left">
                    <p className="truncate text-sm font-medium">{conv.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(conv.lastUpdatedAt, {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 ml-2 opacity-0 group-hover:opacity-100 flex-shrink-0"
                    onClick={(e) => handleDelete(e, conv.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              <p>{conv.title}</p>
            </TooltipContent>
          </Tooltip>
        ))
      ) : (
        <div className="text-center text-sm text-nilo-dark-gray p-4 mt-4">
          <p>Nenhuma conversa encontrada.</p>
          <p>Inicie um novo chat para começar.</p>
        </div>
      )}
    </div>
  )
}
