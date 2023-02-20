import Card from 'src/components/Card'
import { getWithNavLayout } from 'src/layouts/WithNav'
import { getCurrentDay, getNextDay, getPreviousDay } from 'src/days/dateUtils'
import DaySummary from 'src/days/components/DaySummary'
import DayHeader from 'src/days/components/DayHeader'
import useStepTransition, { transitionDuration } from 'src/hooks/useStepTransition'
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
