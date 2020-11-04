import { ReactNode } from 'react'
import { Head } from 'blitz'
import Nav from 'app/components/Nav'
import UserBar from 'app/components/UserBar'
import RequireAuth from 'app/auth/components/RequireAuth'

type LayoutProps = {
  title?: string
  children: ReactNode
}

const WithNav = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || 'fitx'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center h-full space-y-4 app-shell">
        <UserBar />
        <div className="flex flex-1 w-full max-w-lg mx-auto">{children}</div>
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
