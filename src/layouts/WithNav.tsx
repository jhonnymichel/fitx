import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useRef } from 'react'
import Nav from 'src/components/Nav'
import UserBar from 'src/auth/components/UserBar'
import RequireAuth from 'src/auth/components/RequireAuth'
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
            <div className="flex flex-1 w-full max-w-lg mx-auto overflow-hidden">{children}</div>
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
