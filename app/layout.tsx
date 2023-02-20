import Head from 'next/head'
import { BlitzProvider } from 'src/blitz-client'
import 'src/styles/index.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>{'fitx'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <BlitzProvider>{children}</BlitzProvider>
      </body>
    </html>
  )
}
