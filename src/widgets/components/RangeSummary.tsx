import * as Icons from 'src/components/icons'
import { useQuery, useQueryErrorResetBoundary } from '@blitzjs/rpc'
import getRangeSummary from '../queries/getRangeSummary'
import { ErrorBoundary, ErrorFallbackProps } from '@blitzjs/next'
import { Suspense } from 'react'
import { WidgetCard, WidgetCardIcon, WidgetCardTitle } from 'src/components/WidgetCard'
import { parseCalorieDeficit } from 'src/fitnessMetrics/calorieDeficit'
import classNames from 'classnames'

function ErrorLoadingSummary({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error.name === 'NotFoundError') {
    return <>NO DATA</>
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

function LoadingSummary() {
  return (
    <div className="self-center ph-item">
      <div>
        <div className="ph-row">
          <div className="ph-col-6"></div>
        </div>
      </div>
    </div>
  )
}

type RangeSummaryProps = {
  rangeInDays: number
  currentDate: Date
  title: string
}

function RangeSummaryWidget(props: RangeSummaryProps) {
  const [data] = useQuery(getRangeSummary, {
    from: props.currentDate,
    last: props.rangeInDays,
  })

  const totals = {
    calorieDeficit: parseCalorieDeficit({
      caloriesBurned: data.caloriesBurned,
      foodCalories: data.foodCalories,
      goals: data.currentGoals,
    }).deficit,
  }

  const avgs = {
    caloriesBurned: data.caloriesBurned / props.rangeInDays,
    foodCalories: data.foodCalories / props.rangeInDays,
  }

  const calorieDeficit = parseCalorieDeficit({
    caloriesBurned: avgs.caloriesBurned,
    foodCalories: avgs.foodCalories,
    goals: data.currentGoals,
  })

  const { deficit, goal, score, goalType } = calorieDeficit

  return (
    <div>
      <div className="flex items-end justify-between">
        <p
          className={classNames('text-lg font-extrabold', {
            'text-emerald-500': deficit > goal,
            'text-emerald-400': deficit > 0 && score >= 0.66 && score < 1,
            'text-yellow-500': deficit > 0 && score < 0.66,
            'text-red-700': deficit < 0,
          })}
        >
          {deficit}
          <span className="text-sm text-neutral-500">/{goal} kcal.</span>
        </p>
        <div className={classNames('text-sm text-neutral-500 uppercase text-bold')}>
          Calorie {goalType === 'DEFICIT' ? 'Deficit' : 'Superavit'} (avg.)
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p
          className={classNames('text-lg font-extrabold', {
            'text-emerald-500': deficit > goal,
            'text-emerald-400': deficit > 0 && score >= 0.66 && score < 1,
            'text-yellow-500': deficit > 0 && score < 0.66,
            'text-red-700': deficit < 0,
          })}
        >
          {totals.calorieDeficit}
          <span className="text-sm text-neutral-500"> kcal.</span>
        </p>
        <div className={classNames('text-sm text-neutral-500 uppercase text-bold')}>
          Calorie {goalType === 'DEFICIT' ? 'Deficit' : 'Superavit'} (total)
        </div>
      </div>
      <hr className="m-3" />
    </div>
  )
}

function RangeSummary(props: RangeSummaryProps) {
  const boundary = useQueryErrorResetBoundary()

  return (
    <WidgetCard>
      <WidgetCardTitle>
        <WidgetCardIcon component={Icons.Cardio}></WidgetCardIcon>
        <WidgetCardIcon component={Icons.Food}></WidgetCardIcon>
        <WidgetCardIcon component={Icons.Strength}></WidgetCardIcon>
        <span>{props.title}</span>
      </WidgetCardTitle>
      <ErrorBoundary
        FallbackComponent={ErrorLoadingSummary}
        onReset={() => {
          boundary.reset()
        }}
      >
        <Suspense fallback={<LoadingSummary />}>
          <RangeSummaryWidget {...props} />
        </Suspense>
      </ErrorBoundary>
    </WidgetCard>
  )
}

export default RangeSummary
