import RequireAuth from 'app/auth/components/RequireAuth'
import Card from 'app/components/Card'
import getDay from 'app/days/queries/getDay'
import WithNav from 'app/layouts/WithNav'
import { Link, useQuery, useRouter } from 'blitz'
import classNames from 'classnames'
import { Suspense, useEffect, useState } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { getCurrentDay } from 'app/days/date-utils'

function Day() {
  const [day] = useQuery(getDay, { where: { date: { equals: getCurrentDay() } } }, {})

  return <pre>{JSON.stringify(day, null, 2)}</pre>
}

function EmptyState() {
  return <>Empty meu paia</>
}

function ErrorGateway({ error, resetErrorBoundary }: FallbackProps) {
  if (error?.name === 'NotFoundError') {
    return (
      <div>
        <EmptyState />
      </div>
    )
  }

  return (
    <>
      gave bad: {error?.name} - {error?.message} <button onClick={resetErrorBoundary}>Retry</button>
    </>
  )
}

function Index() {
  return (
    <Card>
      <ErrorBoundary FallbackComponent={ErrorGateway}>
        <Suspense fallback={<>Loading</>}>
          <Day />
        </Suspense>
      </ErrorBoundary>
    </Card>
  )
}

Index.getLayout = function WithNavLayout(page) {
  return (
    <RequireAuth>
      <WithNav>{page}</WithNav>
    </RequireAuth>
  )
}
export default Index
