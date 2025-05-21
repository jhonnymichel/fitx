import Card from 'src/core/components/Card'
import { getWithNavLayout } from 'src/layouts/WithNav'
import {
  diffInDays,
  getCurrentPeriodRange,
  getNextPeriodRange,
  getPreviousPeriodRange,
} from 'src/core/dateUtils'
import PeriodProgressHeader from 'src/day/components/PeriodProgressHeader'
import useStepTransition, { transitionDuration } from 'src/hooks/useStepTransition'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import WeightProgress from 'src/widgets/components/WeightProgress'
import CalorieDeficitProgressWidget from 'src/widgets/components/CalorieDeficitProgress'
import MacroIntakeProgressWidget from 'src/widgets/components/MacroIntakeProgress'

const WEEK = 'week'

function WeekProgress({ range }: { range: [Date, Date] }) {
  const [start, end] = range
  const rangeInDays = diffInDays(start, end)

  return (
    <div className="flex flex-col gap-2 xl:gap-4">
      <div>
        <WeightProgress
          currentDate={end}
          rangeInDays={diffInDays(start, end)}
          title="Weight Change"
        ></WeightProgress>
      </div>
      <div>
        <CalorieDeficitProgressWidget
          currentDate={end}
          rangeInDays={rangeInDays}
          periodLabel={WEEK}
        ></CalorieDeficitProgressWidget>
      </div>
      <div>
        <MacroIntakeProgressWidget
          currentDate={end}
          rangeInDays={rangeInDays}
          periodLabel={WEEK}
        ></MacroIntakeProgressWidget>
      </div>
    </div>
  )
}

function WeekPage() {
  const [currentWeek, animationClassNames, setCurrentWeek] = useStepTransition<[Date, Date]>(
    getCurrentPeriodRange(WEEK),
    'transition',
    (current, next) => next[0] > current[0]
  )

  const [weekStart] = currentWeek

  const prevWeek = () => {
    setCurrentWeek(getPreviousPeriodRange(weekStart, WEEK))
  }
  const nextWeek = () => {
    setCurrentWeek(getNextPeriodRange(weekStart, WEEK))
  }

  return (
    <div className="flex flex-col w-full h-full">
      <PeriodProgressHeader
        onPrevClick={prevWeek}
        onNextClick={nextWeek}
        periodRange={currentWeek}
        currentPeriod={WEEK}
      />
      <SwitchTransition>
        <CSSTransition
          key={currentWeek}
          classNames={animationClassNames}
          timeout={transitionDuration.transition}
        >
          <Card>
            <WeekProgress range={currentWeek} />
          </Card>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

WeekPage.getLayout = getWithNavLayout

export default WeekPage
