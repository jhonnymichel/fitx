import RequireAuth from 'app/auth/components/RequireAuth'
import Card from 'app/components/Card'
import WithNav from 'app/layouts/WithNav'
import { Link, useRouter } from 'blitz'
import classNames from 'classnames'
import { useState } from 'react'

function Week() {
  return (
    <RequireAuth>
      <div className="p-4">
        <Card></Card>
      </div>
    </RequireAuth>
  )
}

Week.getLayout = function WithNavLayout(page) {
  return <WithNav>{page}</WithNav>
}

export default Week
