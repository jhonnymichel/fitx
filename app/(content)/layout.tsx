'use client'

import { usePathname } from 'next/navigation'
import Nav from 'src/components/Nav'
import UserBar from 'src/auth/components/UserBar'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

function ContentLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  return (
    <div className="flex flex-col items-center h-full space-y-4 app-shell">
      <UserBar />
      <SwitchTransition>
        <CSSTransition key={path} classNames="transition-route-change" timeout={200}>
          <div className="flex flex-1 w-full max-w-lg mx-auto overflow-hidden">{children}</div>
        </CSSTransition>
      </SwitchTransition>
      <Nav />
    </div>
  )
}

export default ContentLayout
