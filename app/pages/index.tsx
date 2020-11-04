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
  const [day, { refetch, error }] = useQuery(
    getDay,
    {
      where: { date: { equals: getCurrentDay() } },
    },
    { suspense: false, useErrorBoundary: false }
  )

  if (error && (error as Error).name !== 'NotFoundError') {
    return <ErrorMessage error={error as Error} resetErrorBoundary={refetch} />
  }

  return <DaySummary refetch={refetch} day={day} />
}

function Index() {
  return (
    <Card>
      <DayHeader />
      <Day />
    </Card>
  )
}

Index.getLayout = getWithNavLayout

export default Index
