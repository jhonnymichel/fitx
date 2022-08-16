import Link from 'next/link'
import { useRouter } from 'next/router'
import RequireAuth from 'app/auth/components/RequireAuth'
import Card from 'app/components/Card'
import WithNav from 'app/layouts/WithNav'
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
