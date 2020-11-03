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

  return <DaySummary day={day} />
}

function ErrorGateway({ error, resetErrorBoundary }: FallbackProps) {
  return error?.name === 'NotFoundError' ? (
    <DaySummary />
  ) : (
    <ErrorMessage error={error} resetErrorBoundary={resetErrorBoundary} />
  )
}

function Loading() {
  return (
    <>
      <LoadingDaySummary />
    </>
  )
}

function Index() {
  return (
    <Card>
      <DayHeader />
      <ErrorBoundary FallbackComponent={ErrorGateway}>
        <Suspense fallback={<Loading />}>
          <Day />
        </Suspense>
      </ErrorBoundary>
    </Card>
  )
}

Index.getLayout = getWithNavLayout

export default Index
