import Card from 'app/components/Card'
import { getWithNavLayout } from 'app/layouts/WithNav'
import { getCurrentDay, getNextDay, getPreviousDay } from 'app/days/dateUtils'
import DaySummary from 'app/days/components/DaySummary'
import DayHeader from 'app/days/components/DayHeader'
import useStepTransition, { transitionDuration } from 'app/hooks/useStepTransition'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

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
            <DaySummary currentDay={currentDay} />
          </Card>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

Index.getLayout = getWithNavLayout

export default Index
