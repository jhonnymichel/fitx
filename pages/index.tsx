import Card from 'src/components/Card'
import { getWithNavLayout } from 'src/layouts/WithNav'
import { getCurrentDay, getNextDay, getPreviousDay } from 'src/days/dateUtils'
import DaySummary from 'src/days/components/DaySummary'
import DayHeader from 'src/days/components/DayHeader'
import useStepTransition, { transitionDuration } from 'src/hooks/useStepTransition'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { useState } from 'react'
import { useQuery } from '@blitzjs/rpc'
import getDay from 'src/days/queries/getDay'
import DayForm from 'src/days/components/DayForm'
import React from 'react'
import Slider from 'react-slick'
import RangeSummary from 'src/widgets/components/RangeSummary'

function Index() {
  const [currentDate, animationClassNames, setCurrentDate] = useStepTransition(getCurrentDay())
  const [isEditing, setIsEditing] = useState(false)

  const prevDay = () => {
    setCurrentDate(getPreviousDay(currentDate))
  }
  const nextDay = () => {
    setCurrentDate(getNextDay(currentDate))
  }

  const [data, { refetch, error, isLoading }] = useQuery(
    getDay,
    {
      where: { date: { equals: currentDate } },
    },
    { suspense: false, useErrorBoundary: false }
  )

  return (
    <div className="flex flex-col w-full h-full">
      <DayHeader
        disabled={isEditing}
        onPrevClick={prevDay}
        onNextClick={nextDay}
        currentDay={currentDate}
      />
      <SwitchTransition>
        <CSSTransition
          key={currentDate}
          classNames={animationClassNames}
          timeout={transitionDuration.transition}
        >
          <SwitchTransition>
            <CSSTransition key={isEditing} classNames={'transition-fade'} timeout={200}>
              {isEditing ? (
                <Card>
                  <DayForm
                    data={data}
                    currentDate={currentDate}
                    onEditFinished={() => {
                      setIsEditing(false)
                    }}
                  />
                </Card>
              ) : (
                <Card>
                  <DaySummary data={data} isLoading={isLoading} error={error} refetch={refetch} />
                  <div>
                    <button
                      onClick={() => {
                        setIsEditing(true)
                      }}
                      type="button"
                      className="block w-auto mx-auto mt-4 mb-4 text-white bg-teal-700 button"
                    >
                      Enter Data
                    </button>
                  </div>
                  <div className="bg-neutral-100">
                    <Slider
                      arrows={false}
                      dots={true}
                      slidesToShow={1}
                      slidesToScroll={1}
                      slidesPerRow={1}
                      rows={1}
                    >
                      <div>
                        <RangeSummary rangeInDays={10} currentDate={currentDate} />
                      </div>
                      <div>
                        <RangeSummary rangeInDays={30} currentDate={currentDate} />
                      </div>
                      <div>
                        <RangeSummary rangeInDays={90} currentDate={currentDate} />
                      </div>
                    </Slider>
                  </div>
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
