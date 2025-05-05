import { WidgetCard, WidgetCardIcon, WidgetCardTitle } from './WidgetCard'
import { ErrorBoundary, ErrorFallbackProps } from '@blitzjs/next'
import { useQuery, useQueryErrorResetBoundary } from '@blitzjs/rpc'
import { Suspense } from 'react'
import getRangeSummary from '../queries/getRangeSummary'
import * as Icons from 'src/core/components/icons'
import { getCaloriesGoalLabel, parseCalorieDeficit } from 'src/fitnessMetrics/calorieDeficit'
import classNames from 'classnames'

type CalorieDeficitWidgetProps = {
  rangeInDays: number
  currentDate: Date
}

export default function CalorieDeficitProgressWidget(props: CalorieDeficitWidgetProps) {
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
          <CalorieDeficitProgress {...props} />
        </Suspense>
      </ErrorBoundary>
    </WidgetCard>
  )
}

function CalorieDeficitProgress(props: CalorieDeficitWidgetProps) {
  const [data] = useQuery(getRangeSummary, {
    from: props.currentDate,
    last: props.rangeInDays,
  })

  const { deficit, goal: endOfWeekGoal } = parseCalorieDeficit({
    caloriesBurned: data.caloriesBurned,
    foodCalories: data.foodCalories,
    goals: {
      ...data.currentGoals,
      caloriesBurned: data.currentGoals.caloriesBurned * props.rangeInDays,
      foodCalories: data.currentGoals.foodCalories * props.rangeInDays,
    },
  })

  const { score, goal: goalOnCurrentDay } = parseCalorieDeficit({
    caloriesBurned: data.caloriesBurned,
    foodCalories: data.foodCalories,
    goals: {
      ...data.currentGoals,
      caloriesBurned: data.currentGoals.caloriesBurned * data.dayCount,
      foodCalories: data.currentGoals.foodCalories * data.dayCount,
    },
  })

  return (
    <div className="flex flex-col gap-2">
      <WidgetCardTitle>
        <WidgetCardIcon component={Icons.Food}></WidgetCardIcon>
        <span>{getCaloriesGoalLabel(data.currentGoals)} progress</span>
      </WidgetCardTitle>
      <div className="flex flex-col items-start w-full">
        <ProgressBar
          className={classNames({
            'bg-emerald-500': deficit >= goalOnCurrentDay,
            'bg-emerald-400': deficit > 0 && score >= 0.66 && score < 1,
            'bg-yellow-500': deficit > 0 && score < 0.66,
            'bg-red-700': deficit < 0,
          })}
          width={deficit / endOfWeekGoal}
          goalWidth={goalOnCurrentDay / endOfWeekGoal}
        ></ProgressBar>
        <div className="flex justify-between w-full space-x-2 font-extrabold">
          <p
            className={classNames('text-sm', {
              'text-emerald-500': deficit >= goalOnCurrentDay,
              'text-emerald-400': deficit > 0 && score >= 0.66 && score < 1,
              'text-yellow-500': deficit > 0 && score < 0.66,
              'text-red-700': deficit < 0,
            })}
          >
            {deficit}
          </p>
          <p className="text-sm text-neutral-500">{endOfWeekGoal} kcal.</p>
        </div>
      </div>
      <div>
        <p className="text-sm">
          You need a daily {(endOfWeekGoal - deficit) / props.rangeInDays - data.dayCount} kcal.{' '}
          {getCaloriesGoalLabel(data.currentGoals).toLowerCase()} to reach end of week goal.
        </p>
      </div>
    </div>
  )
}

function ProgressBar({
  className,
  width,
  goalWidth,
}: {
  className: string
  width: number
  goalWidth: number
}) {
  const cssWidth = Math.max(0, width * 100)

  const cssGoalWidth = Math.max(0, goalWidth * 100)

  console.log('wtf', cssWidth)

  return (
    <div className="relative w-full h-2 rounded-md bg-slate-300">
      <div
        className={
          'bg-slate-400 absolute top-0 left-0 h-2 transition-all duration-1000 ease-out rounded-md z-0'
        }
        style={{ width: `${Math.min(cssGoalWidth || 0.001, 100)}%` }}
      ></div>
      <div
        className={classNames(
          'absolute top-0 left-0 h-2 transition-all duration-1000 ease-out rounded-md z-10',
          className
        )}
        style={{ width: `${Math.min(cssWidth || 0.001, 100)}%` }}
      ></div>
    </div>
  )
}

function ErrorLoadingSummary({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps & CalorieDeficitWidgetProps) {
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
