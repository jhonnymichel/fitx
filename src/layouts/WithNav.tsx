import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import Nav from 'src/components/Nav'
import UserBar from 'src/auth/components/UserBar'
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
            <div className="flex flex-1 w-full max-w-lg px-3 pb-6 mx-auto !-mb-6 overflow-hidden">
              {children}
            </div>
          </CSSTransition>
        </SwitchTransition>
        <Nav />
      </div>
    </>
  )
}

WithNav.authenticate = { redirectTo: '/signup' }

export function getWithNavLayout(page) {
  return <WithNav>{page}</WithNav>
}

export default WithNav
