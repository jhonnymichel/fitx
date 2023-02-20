'use client'

import Card from 'src/components/Card'
import { getCurrentDay, getNextDay, getPreviousDay } from 'src/days/dateUtils'
import DaySummary from 'src/days/components/DaySummary'
import DayHeader from 'src/days/components/DayHeader'
import useStepTransition, { transitionDuration } from 'src/hooks/useStepTransition'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

function Day() {
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
            <DaySummary currentDay={currentDay} />
          </Card>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

export default Day
