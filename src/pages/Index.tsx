import { AgentCard } from '@/components/AgentCard'

const Index = () => {
  return (
    <div className="container mx-auto max-w-6xl">
      <section className="text-center mb-10 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-nilo-petroleum-blue mb-4">
          Escolha seu Agente Nilo
        </h1>
        <p className="text-lg text-nilo-dark-gray max-w-3xl mx-auto">
          Acesse nossos agentes de Inteligência Artificial para otimizar seus
          processos.
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-8">
        <AgentCard
          title="Agente de Captação"
          description="Crie campanhas inteligentes via WhatsApp com base na inteligência Nilo. Engaje pacientes com sequências de mensagens eficazes."
          linkTo="/chat/captacao"
          buttonText="Acessar Agente de Captação"
        />
        <AgentCard
          title="Agente de Diretrizes"
          description="Crie protocolos e linhas de cuidado com base nas melhores práticas da Nilo. Construa jornadas assistenciais completas com poucos cliques."
          linkTo="/chat/diretrizes"
          buttonText="Acessar Agente de Diretrizes"
        />
      </div>
    </div>
  )
}

export default Index
