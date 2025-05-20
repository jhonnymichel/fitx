import Card from 'src/core/components/Card'
import { getWithNavLayout } from 'src/layouts/WithNav'
import {
  diffInDays,
  getCurrentWeekRange,
  getNextWeekRange,
  getPreviousWeekRange,
} from 'src/core/dateUtils'
import WeekHeader from 'src/day/components/WeekHeader'
import useStepTransition, { transitionDuration } from 'src/hooks/useStepTransition'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import WeightProgress from 'src/widgets/components/WeightProgress'
import CalorieDeficitProgressWidget from 'src/widgets/components/CalorieDeficitProgress'
import MacroIntakeProgressWidget from 'src/widgets/components/MacroIntakeProgress'
import CalendarGrid from 'src/core/components/CalendarGrid'
import classNames from 'classnames'

function Week({ range }: { range: [Date, Date] }) {
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
