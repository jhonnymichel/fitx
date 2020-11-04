import RequireAuth from 'app/auth/components/RequireAuth'
import Card from 'app/components/Card'
import WithNav from 'app/layouts/WithNav'
import { Link, useRouter } from 'blitz'
import classNames from 'classnames'
import { useState } from 'react'

function Week() {
  return <Card>Month</Card>
}

Week.getLayout = function WithNavLayout(page) {
  return (
    <RequireAuth>
      <WithNav>{page}</WithNav>
    </RequireAuth>
  )
}

export default Week
