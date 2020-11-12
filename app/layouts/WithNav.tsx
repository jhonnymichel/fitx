import { ReactNode, useEffect, useRef } from 'react'
import { Head, useRouter } from 'blitz'
import Nav from 'app/components/Nav'
import UserBar from 'app/auth/components/UserBar'
import RequireAuth from 'app/auth/components/RequireAuth'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

type LayoutProps = {
  title?: string
  children: ReactNode
}

const WithNav = ({ title, children }: LayoutProps) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{title || 'fitx'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center h-full space-y-4 app-shell">
        <UserBar />
        <SwitchTransition>
          <CSSTransition key={router.asPath} classNames="transition-route-change" timeout={200}>
            <div className="flex flex-1 w-full max-w-lg mx-auto">{children}</div>
          </CSSTransition>
        </SwitchTransition>
        <Nav />
      </div>
    </>
  )
}

export function getWithNavLayout(page) {
  return (
    <RequireAuth>
      <WithNav>{page}</WithNav>
    </RequireAuth>
  )
}

export default WithNav
