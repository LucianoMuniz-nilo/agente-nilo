import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

interface AgentCardProps {
  title: string
  description: string
  linkTo: string
  buttonText: string
}

export const AgentCard = ({
  title,
  description,
  linkTo,
  buttonText,
}: AgentCardProps) => {
  return (
    <Card className="flex flex-1 flex-col bg-white rounded-lg shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-250 ease-out">
      <CardHeader className="p-8">
        <CardTitle className="text-2xl text-nilo-petroleum-blue font-bold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-8 pt-0">
        <CardDescription className="text-base text-nilo-dark-gray leading-relaxed mb-6">
          {description}
        </CardDescription>
      </CardContent>
      <div className="p-8 pt-0 mt-auto">
        <Button
          asChild
          className="w-full bg-nilo-petroleum-blue hover:bg-[#173342] transition-colors duration-200 group"
        >
          <Link to={linkTo}>
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}
