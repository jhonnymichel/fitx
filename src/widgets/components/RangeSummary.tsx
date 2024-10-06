import * as Icons from 'src/core/components/icons'
import { useQuery, useQueryErrorResetBoundary } from '@blitzjs/rpc'
import getRangeSummary from '../queries/getRangeSummary'
import { ErrorBoundary, ErrorFallbackProps } from '@blitzjs/next'
import { Suspense } from 'react'
import { parseCalorieDeficit } from 'src/fitnessMetrics/calorieDeficit'
import classNames from 'classnames'
import { parseMacros } from 'src/fitnessMetrics/macros'
import { WidgetCard, WidgetCardIcon, WidgetCardTitle } from './WidgetCard'

type RangeSummaryProps = {
  rangeInDays: number
  currentDate: Date
}

type TitleProps = {
  dayCount: number
  foundCount?: number
}

function Title(props: TitleProps) {
  return (
    <WidgetCardTitle>
      <WidgetCardIcon component={Icons.Cardio}></WidgetCardIcon>
      <WidgetCardIcon component={Icons.Food}></WidgetCardIcon>
      <WidgetCardIcon component={Icons.Strength}></WidgetCardIcon>
      <span>
        Last {props.dayCount} days {(props?.foundCount ?? 0) > 0 && `(found ${props.foundCount})`}
      </span>
    </WidgetCardTitle>
  )
}

function ErrorLoadingSummary({
  error,
  resetErrorBoundary,
  rangeInDays,
}: ErrorFallbackProps & RangeSummaryProps) {
  if (error.name === 'NotFoundError') {
    return (
      <>
        <Title dayCount={rangeInDays}></Title>
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

function LoadingSummary(props: RangeSummaryProps) {
  return (
    <>
      <Title dayCount={props.rangeInDays}></Title>
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
    caloriesBurned: data.caloriesBurned / data.dayCount,
    foodCalories: data.foodCalories / data.dayCount,
    foodCarbs: data.foodCarbs / data.dayCount,
    foodProtein: data.foodProtein / data.dayCount,
    foodFat: data.foodFat / data.dayCount,
  }

  const calorieDeficit = parseCalorieDeficit({
    caloriesBurned: avgs.caloriesBurned,
    foodCalories: avgs.foodCalories,
    goals: data.currentGoals,
  })

  const { deficit, goal, score, goalType } = calorieDeficit

  const macros = parseMacros({
    foodCarbs: avgs.foodCarbs,
    foodFat: avgs.foodFat,
    foodProtein: avgs.foodProtein,
    goals: data.currentGoals,
  })

  return (
    <>
      <Title dayCount={props.rangeInDays} foundCount={data.dayCount}></Title>
      <div className="flex items-end justify-between">
        <p
          className={classNames('text-lg font-extrabold', {
            'text-emerald-500': deficit >= goal,
            'text-emerald-400': deficit > 0 && score >= 0.66 && score < 1,
            'text-yellow-500': deficit > 0 && score < 0.66,
            'text-red-700': deficit < 0,
          })}
        >
          {Math.round(deficit)}
          <span className="text-sm text-neutral-500">/{goal} kcal.</span>
        </p>
        <div className={classNames('text-sm text-neutral-500 uppercase text-bold')}>
          Calorie {goalType === 'DEFICIT' ? 'Deficit' : 'Superavit'} (avg.)
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p
          className={classNames('text-lg font-extrabold', {
            'text-emerald-500': deficit >= goal,
            'text-emerald-400': deficit > 0 && score >= 0.66 && score < 1,
            'text-yellow-500': deficit > 0 && score < 0.66,
            'text-red-700': deficit < 0,
          })}
        >
          {Math.round(totals.calorieDeficit)}
          <span className="text-sm text-neutral-500"> kcal.</span>
        </p>
        <div className={classNames('text-sm text-neutral-500 uppercase text-bold')}>
          Calorie {goalType === 'DEFICIT' ? 'Deficit' : 'Superavit'} (total)
        </div>
      </div>
      <hr className="m-3" />
      <div className="flex items-end justify-between">
        <p
          className={classNames('text-lg font-extrabold', {
            'text-emerald-500': macros.carbs.score <= 1,
            'text-emerald-400': macros.carbs.score > 1 && macros.carbs.score <= 1.15,
            'text-yellow-500': macros.carbs.score > 1.15 && macros.carbs.score <= 1.3,
            'text-red-500': macros.carbs.score > 1.3 && macros.carbs.score <= 1.45,
            'text-red-700': macros.carbs.score >= 1.45,
          })}
        >
          {Math.round(macros.carbs.value)}
          <span className="text-sm text-neutral-500">/{macros.carbs.goal}g</span>
        </p>
        <div className={classNames('text-sm text-neutral-500 uppercase text-bold')}>
          Carbs (avg.)
        </div>
      </div>

      <div className="flex items-end justify-between">
        <p
          className={classNames('text-lg font-extrabold', {
            'text-emerald-500': macros.protein.score <= 1,
            'text-emerald-400': macros.protein.score > 1 && macros.protein.score <= 1.15,
            'text-yellow-500': macros.protein.score > 1.15 && macros.protein.score <= 1.3,
            'text-red-500': macros.protein.score > 1.3 && macros.protein.score <= 1.45,
            'text-red-700': macros.protein.score >= 1.45,
          })}
        >
          {Math.round(macros.protein.value)}
          <span className="text-sm text-neutral-500">/{macros.protein.goal}g</span>
        </p>
        <div className={classNames('text-sm text-neutral-500 uppercase text-bold')}>
          protein (avg.)
        </div>
      </div>

      <div className="flex items-end justify-between">
        <p
          className={classNames('text-lg font-extrabold', {
            'text-emerald-500': macros.fat.score <= 1,
            'text-emerald-400': macros.fat.score > 1 && macros.fat.score <= 1.15,
            'text-yellow-500': macros.fat.score > 1.15 && macros.fat.score <= 1.3,
            'text-red-500': macros.fat.score > 1.3 && macros.fat.score <= 1.45,
            'text-red-700': macros.fat.score >= 1.45,
          })}
        >
          {Math.round(macros.fat.value)}
          <span className="text-sm text-neutral-500">/{macros.fat.goal}g</span>
        </p>
        <div className={classNames('text-sm text-neutral-500 uppercase text-bold')}>fat (avg.)</div>
      </div>
    </>
  )
}

function RangeSummary(props: RangeSummaryProps) {
  const boundary = useQueryErrorResetBoundary()

  return (
    <WidgetCard>
      <ErrorBoundary
        fallbackRender={(fallbackProps) => <ErrorLoadingSummary {...fallbackProps} {...props} />}
        onReset={() => {
          boundary.reset()
        }}
      >
        <Suspense fallback={<LoadingSummary {...props} />}>
          <RangeSummaryWidget {...props} />
        </Suspense>
      </ErrorBoundary>
    </WidgetCard>
  )
}

export default RangeSummary
