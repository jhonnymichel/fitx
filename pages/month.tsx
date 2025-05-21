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
import ScoreCalendarWidget from 'src/widgets/components/ScoreCalendar'

const MONTH = 'month'

function MonthProgress({ range }: { range: [Date, Date] }) {
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
          periodLabel={MONTH}
        ></CalorieDeficitProgressWidget>
      </div>
      <div>
        <MacroIntakeProgressWidget
          currentDate={end}
          rangeInDays={rangeInDays}
          periodLabel={MONTH}
        ></MacroIntakeProgressWidget>
      </div>
      <ScoreCalendarWidget currentDate={end} rangeInDays={rangeInDays}></ScoreCalendarWidget>
    </div>
  )
}

function MonthPage() {
  const [currentMonth, animationClassNames, setCurrentMonth] = useStepTransition<[Date, Date]>(
    getCurrentPeriodRange(MONTH),
    'transition',
    (current, next) => next[0] > current[0]
  )

  const [monthStart] = currentMonth

  const prevMonth = () => {
    setCurrentMonth(getPreviousPeriodRange(monthStart, MONTH))
  }
  const nextMonth = () => {
    setCurrentMonth(getNextPeriodRange(monthStart, MONTH))
  }

  return (
    <div className="flex flex-col w-full h-full">
      <PeriodProgressHeader
        onPrevClick={prevMonth}
        onNextClick={nextMonth}
        periodRange={currentMonth}
        currentPeriod={MONTH}
      />
      <SwitchTransition>
        <CSSTransition
          key={currentMonth}
          classNames={animationClassNames}
          timeout={transitionDuration.transition}
        >
          <Card>
            <MonthProgress range={currentMonth} />
          </Card>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

MonthPage.getLayout = getWithNavLayout

export default MonthPage
