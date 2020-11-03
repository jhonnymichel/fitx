import RequireAuth from 'app/auth/components/RequireAuth'
import Card from 'app/components/Card'
import getDay from 'app/days/queries/getDay'
import WithNav, { getWithNavLayout } from 'app/layouts/WithNav'
import { Link, useQuery, useRouter } from 'blitz'
import classNames from 'classnames'
import { Suspense, useEffect, useState } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { getCurrentDay } from 'app/days/date-utils'
import DaySummary, { LoadingDaySummary } from 'app/days/components/DaySummary'
import { DateTime } from 'luxon'
import DayHeader from 'app/days/components/DayHeader'
import ErrorMessage from 'app/components/ErrorMessage'

function Day() {
  const [day] = useQuery(getDay, { where: { date: { equals: getCurrentDay() } } }, {})

  return <pre>{JSON.stringify(day, null, 2)}</pre>
}

function ErrorGateway({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div>
      <DayHeader />
      {error?.name === 'NotFoundError' ? (
        <DaySummary />
      ) : (
        <ErrorMessage error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    </div>
  )
}

function Loading() {
  return (
    <>
      <DayHeader />
      <LoadingDaySummary />
    </>
  )
}

function Index() {
  return (
    <Card>
      <ErrorBoundary FallbackComponent={ErrorGateway}>
        <Suspense fallback={<Loading />}>
          <DayHeader edit />
          <Day />
        </Suspense>
      </ErrorBoundary>
    </Card>
  )
}

Index.getLayout = getWithNavLayout

export default Index
