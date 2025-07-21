import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { cn } from '@/lib/utils'

export default function Layout() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isChatRoute = location.pathname.startsWith('/chat')

  if (isAdminRoute) {
    return <Outlet />
  }

  return (
    <div className="flex flex-col min-h-screen bg-nilo-light-gray">
      <Header />
      <main className="flex-grow flex flex-col pt-16 md:pt-20">
        <div
          className={cn(
            'flex-grow flex flex-col',
            !isChatRoute && 'px-4 md:px-6 py-6 md:py-8',
          )}
        >
          <Outlet />
        </div>
      </main>
      {!isChatRoute && <Footer />}
    </div>
  )
}
