import Card from 'app/components/Card'
import { getWithNavLayout } from 'app/layouts/WithNav'
import { useQuery } from 'blitz'
import {
  getCurrentWeekRange,
  getNextWeekRange,
  getPreviousWeekRange,
  getWeekProgress,
} from 'app/days/dateUtils'
import WeekHeader from 'app/days/components/WeekHeader'
import ErrorMessage from 'app/components/ErrorMessage'
import useStepTransition, { transitionDuration } from 'app/hooks/useStepTransition'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import getDays from 'app/days/queries/getDays'
import getDayScore, { getCardioScore, getFoodScore, getStrengthScore } from 'app/days/getScore'

function Week({ range }: { range: [Date, Date] }) {
  const [start, end] = range
  const [data, { refetch, error, isLoading }] = useQuery(
    getDays,
    { where: { date: { gte: start, lte: end } } },
    { suspense: false, useErrorBoundary: false }
  )

  if (error && (error as Error).name !== 'NotFoundError') {
    return <ErrorMessage error={error as Error} resetErrorBoundary={refetch} />
  }

  const scores =
    data?.days.map((day) => {
      const { foodCalories, cardioCount, cardioType, strengthDone, strengthType } = day

      const scores = {
        food: getFoodScore(foodCalories),
        cardio: getCardioScore(cardioType as any, cardioCount),
        strength: getStrengthScore(strengthDone),
      }

      const dayScore = getDayScore(scores)

      return { scores, dayScore }
    }) ?? []

  const weekProgress = getWeekProgress(start, end)

  const weekTotalScores = scores.reduce(
    (week, day) => {
      return {
        scores: {
          cardio: week.scores.cardio + day.scores.cardio,
          food: week.scores.food + week.scores.cardio,
          strength: week.scores.strength + week.scores.strength,
        },
        dayScore: week.dayScore + day.dayScore,
      }
    },
    {
      scores: {
        cardio: 0,
        food: 0,
        strength: 0,
      },
      dayScore: 0,
    }
  )
  const weekScore = weekTotalScores.dayScore / Math.max(Math.min(1, weekProgress), scores.length)

  return <pre>{JSON.stringify(weekScore, null, 2)}</pre>
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
