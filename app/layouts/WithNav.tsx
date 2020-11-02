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

      <div className="space-y-4">
        <UserBar />
        {children}
        <Nav />
      </div>
    </>
  )
}

export default WithNav
