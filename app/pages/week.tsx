import Card from 'app/components/Card'
import { getWithNavLayout } from 'app/layouts/WithNav'
import { useQuery } from 'blitz'
import { getCurrentWeekRange, getNextWeekRange, getPreviousWeekRange } from 'app/days/dateUtils'
import WeekHeader from 'app/days/components/WeekHeader'
import ErrorMessage from 'app/components/ErrorMessage'
import useStepTransition, { transitionDuration } from 'app/hooks/useStepTransition'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import getDays from 'app/days/queries/getDays'

function Week({ range }: { range: [Date, Date] }) {
  const [start, end] = range
  const [days, { refetch, setQueryData, error, isLoading }] = useQuery(
    getDays,
    { where: { date: { gte: start, lte: end } } },
    { suspense: false, useErrorBoundary: false }
  )

  if (error && (error as Error).name !== 'NotFoundError') {
    return <ErrorMessage error={error as Error} resetErrorBoundary={refetch} />
  }

  return <pre>{JSON.stringify(days, null, 2)}</pre>
}

function WeekPage() {
  const [currentWeek, animationClassNames, setCurrentWeek] = useStepTransition<[Date, Date]>(
    getCurrentWeekRange(),
    'transition',
    (current, next) => next[0] > current[0]
  )

  const [weekStart] = currentWeek

  const prevWeek = () => {
    setCurrentWeek(getPreviousWeekRange(weekStart))
  }
  const nextWeek = () => {
    setCurrentWeek(getNextWeekRange(weekStart))
  }

  return (
    <div className="flex flex-col w-full h-full">
      <WeekHeader onPrevClick={prevWeek} onNextClick={nextWeek} weekRange={currentWeek} />
      <SwitchTransition>
        <CSSTransition
          key={currentWeek}
          classNames={animationClassNames}
          timeout={transitionDuration.transition}
        >
          <Card>
            <Week range={currentWeek} />
          </Card>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

WeekPage.getLayout = getWithNavLayout

export default WeekPage
