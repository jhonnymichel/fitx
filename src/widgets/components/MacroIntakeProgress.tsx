import { WidgetCard, WidgetCardIcon, WidgetCardTitle } from './WidgetCard'
import { ErrorBoundary, ErrorFallbackProps } from '@blitzjs/next'
import { useQuery, useQueryErrorResetBoundary } from '@blitzjs/rpc'
import React, { Suspense } from 'react'
import getRangeSummary from '../queries/getRangeSummary'
import * as Icons from 'src/core/components/icons'
import classNames from 'classnames'
import { parseMacros } from 'src/fitnessMetrics/macros'
import { GoalType } from 'db'
import Slider from 'react-slick'

type MacroIntakeProgressWidgetProps = {
  rangeInDays: number
  currentDate: Date
}

export default function MacroIntakeProgressWidget(props: MacroIntakeProgressWidgetProps) {
  const boundary = useQueryErrorResetBoundary()

  return (
    <WidgetCard>
      <ErrorBoundary
        fallbackRender={(fallbackProps) => <ErrorLoadingSummary {...fallbackProps} {...props} />}
        onReset={() => {
          boundary.reset()
        }}
      >
        <Suspense fallback={<LoadingProgress />}>
          <MacroIntakeProgress {...props} />
        </Suspense>
      </ErrorBoundary>
    </WidgetCard>
  )
}

function MacroIntakeProgress(props: MacroIntakeProgressWidgetProps) {
  const [data] = useQuery(getRangeSummary, {
    from: props.currentDate,
    last: props.rangeInDays,
  })

  const weekToDateMacros = parseMacros({
    foodCarbs: data.foodCarbs,
    foodProtein: data.foodProtein,
    foodFat: data.foodFat,
    goals: {
      ...data.currentGoals,
      foodCarbs: data.currentGoals.foodCarbs * data.dayCount,
      foodProtein: data.currentGoals.foodProtein * data.dayCount,
      foodFat: data.currentGoals.foodFat * data.dayCount,
    },
  })

  const endOfWeekMacros = parseMacros({
    foodCarbs: data.foodCarbs,
    foodProtein: data.foodProtein,
    foodFat: data.foodFat,
    goals: {
      ...data.currentGoals,
      foodCarbs: data.currentGoals.foodCarbs * props.rangeInDays,
      foodProtein: data.currentGoals.foodProtein * props.rangeInDays,
      foodFat: data.currentGoals.foodFat * props.rangeInDays,
    },
  })

  const isWeekComplete = data.dayCount === 7

  const dataByMacro = ['protein', 'fat', 'carbs'].map((key) => ({
    name: key.toUpperCase(),
    value: weekToDateMacros[key].value,
    goalOnCurrentDay: weekToDateMacros[key].goal,
    score: weekToDateMacros[key].score,
    endOfWeekGoal: endOfWeekMacros[key].goal,
    goalType: weekToDateMacros[key].goalType,
    pace: (weekToDateMacros[key].value / data.dayCount) * 7,
  }))

  return (
    <div className="pb-5 -mx-2">
      <div className="px-2">
        <WidgetCardTitle>
          <WidgetCardIcon component={Icons.Food}></WidgetCardIcon>
          <span>Macro Intake Progress</span>
        </WidgetCardTitle>
      </div>
      <Slider
        arrows={false}
        dots={true}
        slidesToShow={1}
        slidesToScroll={1}
        slidesPerRow={1}
        rows={1}
      >
        {dataByMacro.map((macro) => (
          <div key={macro.name} className="px-2 py-2">
            <ProgressBar
              key={`${(props.rangeInDays, props.currentDate)}`}
              className={classNames({
                'bg-orange-500': macro.score <= 1 && macro.name === 'CARBS',
                'bg-blue-500': macro.score <= 1 && macro.name === 'PROTEIN',
                'bg-purple-500': macro.score <= 1 && macro.name === 'FAT',
                'bg-orange-400': macro.score > 1 && macro.score <= 1.15 && macro.name === 'CARBS',
                'bg-blue-400': macro.score > 1 && macro.score <= 1.15 && macro.name === 'PROTEIN',
                'bg-purple-400': macro.score > 1 && macro.score <= 1.15 && macro.name === 'FAT',
                'bg-orange-300': macro.score > 1.15 && macro.score <= 1.3 && macro.name === 'CARBS',
                'bg-blue-300': macro.score > 1.15 && macro.score <= 1.3 && macro.name === 'PROTEIN',
                'bg-purple-300': macro.score > 1.15 && macro.score <= 1.3 && macro.name === 'FAT',
                'bg-red-500': macro.score > 1.3 && macro.score <= 1.45,
                'bg-red-700': macro.score >= 1.45,
              })}
              width={macro.value / macro.endOfWeekGoal}
              goalWidth={macro.goalOnCurrentDay / macro.endOfWeekGoal}
              currentGoal={macro.goalOnCurrentDay}
              dayCount={data.dayCount}
              goalType={macro.goalType}
            ></ProgressBar>

            <div className="flex justify-between w-full space-x-2 font-extrabold">
              <p
                className={classNames('text-sm', {
                  'text-emerald-600': macro.score <= 1,
                  'text-emerald-500': macro.score > 1 && macro.score <= 1.15,
                  'text-yellow-500': macro.score > 1.15 && macro.score <= 1.3,
                  'text-red-500': macro.score > 1.3 && macro.score <= 1.45,
                  'text-red-700': macro.score >= 1.45,
                })}
              >
                {macro.value}
              </p>
              <p className="text-sm text-neutral-500">
                {macro.goalType === 'CEILING' ? 'max of' : 'at least'} {macro.endOfWeekGoal}g.
              </p>
            </div>
            <div className="mt-1">
              {!isWeekComplete && (
                <p className="text-sm text-center">
                  You're on pace to end the week at a {(macro.value / data.dayCount).toFixed(0)}g
                  daily{' '}
                  <span
                    className={classNames('p-1 text-white font-semibold', {
                      'bg-orange-500': macro.name === 'CARBS',
                      'bg-blue-500': macro.name === 'PROTEIN',
                      'bg-purple-500': macro.name === 'FAT',
                    })}
                  >
                    {macro.name}
                  </span>{' '}
                  intake.
                </p>
              )}
              {isWeekComplete && (
                <p className="text-sm text-center">
                  You ended the week at a {(macro.value / data.dayCount).toFixed(0)}g daily{' '}
                  <span
                    className={classNames('p-1 text-white font-semibold', {
                      'bg-orange-500': macro.name === 'CARBS',
                      'bg-blue-500': macro.name === 'PROTEIN',
                      'bg-purple-500': macro.name === 'FAT',
                    })}
                  >
                    {macro.name}
                  </span>{' '}
                  intake.
                </p>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

function ProgressBar({
  className,
  width,
  goalWidth,
  dayCount,
  goalType,
}: {
  className: string
  width: number
  goalWidth: number
  currentGoal: number
  dayCount: number
  goalType: GoalType
}) {
  const cssWidth = Math.max(0, width * 100)
  const cssGoalWidth = Math.max(0, goalWidth * 100)

  // Calculate the pace difference
  const paceDifference = (width - goalWidth) / (goalWidth || 1) // avoid division by zero
  const pacePercentage = Math.abs(paceDifference * 100).toFixed(1) // always positive, one decimal

  const tooltipMessage = `${pacePercentage}% ${paceDifference >= 0 ? 'above' : 'below'} wtd ${
    goalType === 'FLOOR' ? 'min' : 'max'
  }`
  return (
    <div className="w-full pt-6">
      <div className="relative w-full h-2 rounded-md bg-slate-200">
        <div
          className="absolute right-0 z-20 w-[2px] h-4 bg-black -top-2"
          style={{ left: `${Math.min(cssGoalWidth || 0.001, 100)}%` }}
        >
          <div
            className={classNames(
              'text-white whitespace-nowrap absolute !py-1 -my-5 !px-2 !text-xs !rounded-none !bg-black !z-50',
              {
                'left-0 top-0': dayCount < 4,
                'right-0 top-0': dayCount >= 4,
              }
            )}
          >
            {tooltipMessage}
          </div>
        </div>
        {/* <div
          data-tooltip-id="notice"
          className={
            'bg-slate-300 absolute top-0 left-0 h-2 transition-all duration-1000 ease-out rounded-md z-0'
          }
          style={{}}
        ></div> */}
        <div
          className={classNames(
            'absolute top-0 left-0 h-2 transition-all duration-1000 ease-out rounded-md z-10',
            className
          )}
          style={{ width: `${Math.min(cssWidth || 0.001, 100)}%` }}
        ></div>
      </div>
    </div>
  )
}

function ErrorLoadingSummary({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps & MacroIntakeProgressWidgetProps) {
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
