import { useQuery, useQueryErrorResetBoundary } from '@blitzjs/rpc'
import { WidgetCard, WidgetCardIcon, WidgetCardTitle } from './WidgetCard'
import { ErrorBoundary, ErrorFallbackProps } from '@blitzjs/next'
import { Suspense, useState } from 'react'
import getRangeDailyScores from '../queries/getRangeDailyScores'
import CalendarGrid, { RenderDayPayload } from 'src/core/components/CalendarGrid'
import { areDatesSameDay } from 'src/core/dateUtils'
import * as Icons from 'src/core/components/icons'
import classNames from 'classnames'
import Slider from 'react-slick'

type ScoreCalendarProps = {
  rangeInDays: number
  currentDate: Date
}

export default function ScoreCalendarWidget(props: ScoreCalendarProps) {
  const boundary = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary
      fallbackRender={(fallbackProps) => <ErrorLoadingSummary {...fallbackProps} {...props} />}
      onReset={() => {
        boundary.reset()
      }}
    >
      <Suspense fallback={<LoadingProgress />}>
        <ScoreCalendar {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}

function ScoreCalendar(props: ScoreCalendarProps) {
  const [data] = useQuery(getRangeDailyScores, {
    from: props.currentDate,
    last: props.rangeInDays + 7,
  })

  const slides = ['Calories', 'Protein', 'Fat', 'Carbs']

  const [currentTitle, setTitle] = useState(slides[0])

  return (
    <WidgetCard className="pb-8">
      <WidgetCardTitle>
        <WidgetCardIcon component={Icons.Food}></WidgetCardIcon>
        <span>Score Calendar - {currentTitle}</span>
      </WidgetCardTitle>
      <Slider
        beforeChange={(current, next) => {
          setTitle(slides[next])
        }}
        arrows={false}
        dots={true}
        slidesToShow={1}
        slidesToScroll={1}
        slidesPerRow={1}
        rows={1}
      >
        <div className="p-[2px] bg-neutral-200">
          <CalendarGrid
            month={props.currentDate.getMonth()}
            year={props.currentDate.getFullYear()}
            renderDay={(day) => {
              return (
                <div className={classNames('relative p-[2px]')}>
                  <p
                    className={classNames({
                      'text-neutral-400': day.padding,
                    })}
                  >
                    {day.date.getDate()}
                  </p>
                  <p>
                    <CalorieScoreCell calendarDate={day} dayData={data} />
                  </p>
                </div>
              )
            }}
          ></CalendarGrid>
        </div>
        <div className="p-[2px] bg-neutral-200">
          <CalendarGrid
            month={props.currentDate.getMonth()}
            year={props.currentDate.getFullYear()}
            renderDay={(day) => {
              return (
                <div className={classNames('relative p-[2px]')}>
                  <p
                    className={classNames({
                      'text-neutral-400': day.padding,
                    })}
                  >
                    {day.date.getDate()}
                  </p>
                  <p>
                    <MacroScoreCell calendarDate={day} dayData={data} macroKey="protein" />
                  </p>
                </div>
              )
            }}
          ></CalendarGrid>
        </div>
        <div className="p-[2px] bg-neutral-200">
          <CalendarGrid
            month={props.currentDate.getMonth()}
            year={props.currentDate.getFullYear()}
            renderDay={(day) => {
              return (
                <div className={classNames('relative p-[2px]')}>
                  <p
                    className={classNames({
                      'text-neutral-400': day.padding,
                    })}
                  >
                    {day.date.getDate()}
                  </p>
                  <p>
                    <MacroScoreCell calendarDate={day} dayData={data} macroKey="fat" />
                  </p>
                </div>
              )
            }}
          ></CalendarGrid>
        </div>
        <div className="p-[2px] bg-neutral-200">
          <CalendarGrid
            month={props.currentDate.getMonth()}
            year={props.currentDate.getFullYear()}
            renderDay={(day) => {
              return (
                <div className={classNames('relative p-[2px]')}>
                  <p
                    className={classNames({
                      'text-neutral-400': day.padding,
                    })}
                  >
                    {day.date.getDate()}
                  </p>
                  <p>
                    <MacroScoreCell calendarDate={day} dayData={data} macroKey="carbs" />
                  </p>
                </div>
              )
            }}
          ></CalendarGrid>
        </div>
      </Slider>
    </WidgetCard>
  )
}

type CellProps = {
  calendarDate: RenderDayPayload
  dayData: Awaited<ReturnType<typeof getRangeDailyScores>>
}

function CalorieScoreCell(props: CellProps) {
  const { calendarDate, dayData } = props
  const dayInData = dayData.find((item) => areDatesSameDay(calendarDate.date, item.day.date))

  if (!dayInData) return null

  const { deficit, goal, score } = dayInData.scores.calories

  return (
    <div
      className={classNames('w-1/2 mx-auto  transform scale-75 rounded-full aspect-square', {
        'bg-emerald-500 !scale-100': deficit >= goal,
        'bg-emerald-400': deficit > 0 && score >= 0.66 && score < 1,
        'bg-yellow-500': deficit > 0 && score < 0.66,
        'bg-red-700 !scale-100': deficit < 0,
        '!scale-50': calendarDate.padding,
      })}
    ></div>
  )
}

type MacroCellProps = CellProps & { macroKey: 'carbs' | 'protein' | 'fat' }

function MacroScoreCell(props: MacroCellProps) {
  const { calendarDate, dayData } = props
  const dayInData = dayData.find((item) => areDatesSameDay(calendarDate.date, item.day.date))

  if (!dayInData) return null

  const { score } = dayInData.scores.macros[props.macroKey]

  return (
    <div
      className={classNames('w-1/2 mx-auto transform scale-75 rounded-full aspect-square', {
        'bg-orange-500 !scale-100': score <= 1 && props.macroKey === 'carbs',
        'bg-blue-500 !scale-100': score <= 1 && props.macroKey === 'protein',
        'bg-purple-500 !scale-100': score <= 1 && props.macroKey === 'fat',
        'bg-orange-400': score > 1 && score <= 1.15 && props.macroKey === 'carbs',
        'bg-blue-400': score > 1 && score <= 1.15 && props.macroKey === 'protein',
        'bg-purple-400': score > 1 && score <= 1.15 && props.macroKey === 'fat',
        'bg-orange-300': score > 1.15 && score <= 1.3 && props.macroKey === 'carbs',
        'bg-blue-300': score > 1.15 && score <= 1.3 && props.macroKey === 'protein',
        'bg-purple-300': score > 1.15 && score <= 1.3 && props.macroKey === 'fat',
        'bg-red-500 !scale-100': score > 1.3 && score <= 1.45,
        'bg-red-700 !scale-100': score >= 1.45,
        '!scale-50': calendarDate.padding,
      })}
    ></div>
  )
}

function ErrorLoadingSummary({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps & ScoreCalendarProps) {
  if (error.name === 'NotFoundError') {
    return (
      <>
        <div>NO DATA</div>
      </>
    )
  }

  return (
    <div className="text-red-800">
      Error loading data{' '}
      <button
        className="text-black bg-neutral-100 button hover:bg-neutral-400"
        onClick={() => {
          resetErrorBoundary()
        }}
      >
        Retry
      </button>
    </div>
  )
}

function LoadingProgress() {
  return (
    <>
      <div className="self-center ph-item">
        <div>
          <div className="ph-row">
            <div className="ph-col-6"></div>
          </div>
        </div>
      </div>
    </>
  )
}
