import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full bg-white z-[100] transition-shadow duration-300',
        'h-16 md:h-20',
        isScrolled ? 'shadow-header-scroll' : '',
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-full px-4 md:px-6">
        <Link
          to="/"
          className="text-nilo-petroleum-blue font-logo font-bold text-3xl md:text-4xl"
        >
          nilo
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/admin/dashboard"
                aria-label="Painel de Administração"
                className="text-nilo-dark-gray hover:text-nilo-light-blue transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
              >
                <Settings className="h-6 w-6" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configurações</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}
