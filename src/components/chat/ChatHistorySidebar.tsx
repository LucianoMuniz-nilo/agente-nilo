import { Link, useParams } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import { AgentType } from '@/types'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { ConversationList } from './ConversationList'

export const ChatHistorySidebar = () => {
  const { agentType } = useParams<{ agentType: AgentType }>()

  if (!agentType) return null

  return (
    <Sidebar className="hidden lg:flex">
      <SidebarContent className="w-72 bg-gray-50 border-r border-nilo-border-gray flex flex-col p-0">
        <SidebarHeader className="p-4 border-b">
          <Button asChild className="w-full" variant="outline">
            <Link to={`/chat/${agentType}`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Chat
            </Link>
          </Button>
        </SidebarHeader>
        <ScrollArea className="flex-1">
          <ConversationList />
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}
