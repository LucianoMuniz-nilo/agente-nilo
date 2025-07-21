import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '@/contexts/SettingsContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Eye, EyeOff, Home } from 'lucide-react'

export default function AdminDashboard() {
  const { settings, saveSettings } = useSettings()
  const { logout } = useAuth()
  const [apiKey, setApiKey] = useState(settings.apiKey)
  const [captacaoId, setCaptacaoId] = useState(settings.captacaoAgentId)
  const [diretrizesId, setDiretrizesId] = useState(settings.diretrizesAgentId)
  const [showApiKey, setShowApiKey] = useState(false)

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    saveSettings({
      apiKey,
      captacaoAgentId: captacaoId,
      diretrizesAgentId: diretrizesId,
    })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-nilo-petroleum-blue">
          Painel de Administração
        </h1>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon">
                  <Link to="/" aria-label="Ir para a página inicial">
                    <Home className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Início</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações da OpenAI</CardTitle>
          <CardDescription>
            Gerencie as credenciais para a integração com a OpenAI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                >
                  {showApiKey ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="captacaoId">ID do Agente de Captação</Label>
              <Input
                id="captacaoId"
                type="text"
                value={captacaoId}
                onChange={(e) => setCaptacaoId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diretrizesId">ID do Agente de Diretrizes</Label>
              <Input
                id="diretrizesId"
                type="text"
                value={diretrizesId}
                onChange={(e) => setDiretrizesId(e.target.value)}
              />
            </div>
            <Button type="submit">Salvar Configurações</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
