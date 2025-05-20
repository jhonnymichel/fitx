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
import CalendarGrid from 'src/core/components/CalendarGrid'
import classNames from 'classnames'
import { useState } from 'react'

function PeriodProgress({ range }: { range: [Date, Date] }) {
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
        ></CalorieDeficitProgressWidget>
      </div>
      <div>
        <MacroIntakeProgressWidget
          currentDate={end}
          rangeInDays={rangeInDays}
        ></MacroIntakeProgressWidget>
      </div>
      <div className="p-[2px] bg-neutral-200">
        <CalendarGrid
          month={start.getMonth()}
          year={start.getFullYear()}
          renderDay={(day) => {
            return (
              <span
                className={classNames('p-1 md:text-sm text-xs', { 'text-gray-400': day.padding })}
              >
                {day.date.getDate()}
              </span>
            )
          }}
        ></CalendarGrid>
      </div>
    </div>
  )
}

function PeriodProgressPage() {
  const [periodMode, setPeriodMode] = useState<'week' | 'month'>('week')

  const [currentRange, animationClassNames, setCurrentRange] = useStepTransition<[Date, Date]>(
    getCurrentPeriodRange(periodMode),
    'transition',
    (current, next) => next[0] > current[0]
  )

  console.log(periodMode)

  const [periodStart] = currentRange

  const prevPeriod = () => {
    setCurrentRange(getPreviousPeriodRange(periodStart, periodMode))
  }
  const nextPeriod = () => {
    setCurrentRange(getNextPeriodRange(periodStart, periodMode))
  }

  return (
    <div className="flex flex-col w-full h-full">
      <PeriodProgressHeader
        onPrevClick={prevPeriod}
        onNextClick={nextPeriod}
        periodRange={currentRange}
        currentPeriod={periodMode}
        onPeriodChangeClick={() => {
          setPeriodMode((periodMode) => {
            const newPeriod = periodMode === 'week' ? 'month' : 'week'
            setCurrentRange(getCurrentPeriodRange(newPeriod))
            return periodMode === 'week' ? 'month' : 'week'
          })
        }}
      />
      <SwitchTransition>
        <CSSTransition
          key={currentRange}
          classNames={animationClassNames}
          timeout={transitionDuration.transition}
        >
          <Card>
            <PeriodProgress range={currentRange} />
          </Card>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

PeriodProgressPage.getLayout = getWithNavLayout

export default PeriodProgressPage
