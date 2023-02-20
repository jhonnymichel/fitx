'use client'

import Head from 'next/head'
import React from 'react'
import { BlitzProvider } from 'src/blitz-client'

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
