import Link from 'next/link'
import { useRouter } from 'next/router'
import RequireAuth from 'src/auth/components/RequireAuth'
import Card from 'src/components/Card'
import WithNav from 'src/layouts/WithNav'
import classNames from 'classnames'
import { useState } from 'react'

function Month() {
  return <Card>Month</Card>
}

Month.getLayout = function WithNavLayout(page) {
  return (
    <RequireAuth>
      <WithNav>{page}</WithNav>
    </RequireAuth>
  )
}
export default Month
