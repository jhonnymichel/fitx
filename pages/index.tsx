import Card from 'src/components/Card'
import { getWithNavLayout } from 'src/layouts/WithNav'
import { getCurrentDay, getNextDay, getPreviousDay } from 'src/days/dateUtils'
import DaySummary from 'src/days/components/DaySummary'
import DayHeader from 'src/days/components/DayHeader'
import useStepTransition, { transitionDuration } from 'src/hooks/useStepTransition'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { useState } from 'react'

function Index() {
  const [currentDay, animationClassNames, setCurrentDay] = useStepTransition(getCurrentDay())
  const [isEditing, setIsEditing] = useState(false)

  const prevDay = () => {
    setCurrentDay(getPreviousDay(currentDay))
  }
  const nextDay = () => {
    setCurrentDay(getNextDay(currentDay))
  }

  return (
    <div className="flex flex-col w-full h-full">
      <DayHeader
        disabled={isEditing}
        onPrevClick={prevDay}
        onNextClick={nextDay}
        currentDay={currentDay}
      />
      <SwitchTransition>
        <CSSTransition
          key={currentDay}
          classNames={animationClassNames}
          timeout={transitionDuration.transition}
        >
          <SwitchTransition>
            <CSSTransition key={isEditing} classNames={'transition-fade'} timeout={200}>
              {isEditing ? (
                <Card>
                  <div>Fala Nighel</div>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                    }}
                    className="button"
                    type="button"
                  >
                    Done
                  </button>
                </Card>
              ) : (
                <Card>
                  <DaySummary currentDay={currentDay} />
                  <button
                    onClick={() => {
                      setIsEditing(true)
                    }}
                    className="button"
                    type="button"
                  >
                    Enter Data
                  </button>
                </Card>
              )}
            </CSSTransition>
          </SwitchTransition>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

Index.getLayout = getWithNavLayout

export default Index
