import { ReactNode } from 'react'
import { Head } from 'blitz'
import Nav from 'app/components/Nav'

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

      {children}

      <Nav />
    </>
  )
}

export default WithNav
