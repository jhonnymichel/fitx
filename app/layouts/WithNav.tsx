import { ReactNode } from 'react'
import { Head } from 'blitz'
import Nav from 'app/components/Nav'
import UserBar from 'app/components/UserBar'

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

      <div className="flex flex-col items-center h-screen space-y-4">
        <UserBar />
        <div className="flex flex-1 w-full max-w-lg mx-auto">{children}</div>
        <Nav />
      </div>
    </>
  )
}

export default WithNav
