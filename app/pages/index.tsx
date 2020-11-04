import RequireAuth from 'app/auth/components/RequireAuth'
import Card from 'app/components/Card'
import getDay from 'app/days/queries/getDay'
import WithNav, { getWithNavLayout } from 'app/layouts/WithNav'
import { Link, useQuery, useRouter } from 'blitz'
import classNames from 'classnames'
import { Suspense, useEffect, useState } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { getCurrentDay, getNextDay, getPreviousDay } from 'app/days/date-utils'
import DaySummary, { LoadingDaySummary } from 'app/days/components/DaySummary'
import { DateTime } from 'luxon'
import DayHeader from 'app/days/components/DayHeader'
import ErrorMessage from 'app/components/ErrorMessage'
import useStepTransition, { transitionDuration } from 'app/hooks/useStepTransition'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

function Day({ currentDay }: { currentDay: Date }) {
  const [day, { refetch, error }] = useQuery(
    getDay,
    {
      where: { date: { equals: currentDay } },
    },
    { suspense: false, useErrorBoundary: false }
  )

  if (error && (error as Error).name !== 'NotFoundError') {
    return <ErrorMessage error={error as Error} resetErrorBoundary={refetch} />
  }

  return <DaySummary refetch={refetch} day={day} currentDay={currentDay} />
}

function Index() {
  const [currentDay, animationClassNames, setCurrentDay] = useStepTransition<Date>(getCurrentDay())

  const prevDay = () => {
    setCurrentDay(getPreviousDay(currentDay))
  }
  const nextDay = () => {
    setCurrentDay(getNextDay(currentDay))
  }

  return (
    <div className="flex flex-col w-full h-full">
      <DayHeader onPrevClick={prevDay} onNextClick={nextDay} currentDay={currentDay} />
      <SwitchTransition>
        <CSSTransition
          key={currentDay}
          classNames={animationClassNames}
          timeout={transitionDuration.transition}
        >
          <Card>
            <Day currentDay={currentDay} />
          </Card>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

Index.getLayout = getWithNavLayout

export default Index
