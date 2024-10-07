import * as Icons from 'src/core/components/icons'
import { useQuery, useQueryErrorResetBoundary } from '@blitzjs/rpc'
import { ErrorBoundary, ErrorFallbackProps } from '@blitzjs/next'
import { Suspense } from 'react'
import { WidgetCard, WidgetCardIcon, WidgetCardTitle } from './WidgetCard'
import getWeightProgress from '../queries/getWeightProgress'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getCaloriesGoalType } from 'src/fitnessMetrics/calorieDeficit'
import classNames from 'classnames'

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
      <WidgetCardIcon component={Icons.Scale}></WidgetCardIcon>
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

function LoadingProgress(props: RangeSummaryProps) {
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

function WeightProgressWidget(props: RangeSummaryProps) {
  const [data] = useQuery(getWeightProgress, {
    from: props.currentDate,
    last: props.rangeInDays,
  })

  const minWeight = Math.min(...data.weightByDay.map((item) => item.weightInKilograms))
  const maxWeight = Math.max(...data.weightByDay.map((item) => item.weightInKilograms))

  const goalsType = getCaloriesGoalType(data.currentGoals)

  const downsampleData = (data: any[], limit) => {
    const length = data.length

    // If data points are fewer than or equal to the limit, return original data
    if (length <= limit) return data

    // Always include the first and last points
    const keep = [data[0]]

    // Calculate the interval to pick points between the first and last
    const interval = (length - 2) / (limit - 2)

    for (let i = 1; i < limit - 1; i++) {
      const index = Math.round(i * interval) // Pick points spaced proportionally
      keep.push(data[index])
    }

    // Always include the last point
    keep.push(data[length - 1])

    return keep
  }

  return (
    <>
      <div className="h-[100px]">
        <Title dayCount={props.rangeInDays} foundCount={data.dayCount}></Title>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            height={100}
            data={downsampleData(data.weightByDay, 10)}
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            {/* Adjust domain with a bit of padding */}
            <YAxis
              width={10}
              domain={[minWeight * 0.95, maxWeight * 1.05]}
              tick={false}
              axisLine={false} // Hides the axis line
              tickLine={false} // Hides the tick lines
              allowDecimals
            />
            <Line
              type="monotone"
              dataKey="weightInKilograms"
              stroke="rgb(15, 118, 110)"
              strokeWidth={2}
              label={{
                position: 'top',
                fill: 'current',
                fontSize: 12,
                fontFamily: 'inherit',
                fontWeight: '600',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h1
          className={classNames('text-end text-lg uppercase font-extrabold', {
            'text-emerald-500':
              (data.progress < 0 && goalsType === 'DEFICIT') ||
              (data.progress > 0 && goalsType === 'SUPERAVIT'),
            'text-red-700':
              (data.progress > 0 && goalsType === 'DEFICIT') ||
              (data.progress < 0 && goalsType === 'SUPERAVIT'),
          })}
        >
          {data.progress < 0 ? (
            <>
              {(data.progress * -1).toFixed(1)}
              <span className="text-sm font-normal text-neutral-500">
                <span className="normal-case">kg.</span> lost
              </span>
            </>
          ) : (
            <>
              {data.progress.toFixed(1)}
              <span className="text-sm font-normal text-neutral-500">
                <span className="normal-case">kg.</span> gained
              </span>
            </>
          )}
        </h1>
      </div>
    </>
  )
}

function WeightProgress(props: RangeSummaryProps) {
  const boundary = useQueryErrorResetBoundary()

  return (
    <WidgetCard>
      <ErrorBoundary
        fallbackRender={(fallbackProps) => <ErrorLoadingSummary {...fallbackProps} {...props} />}
        onReset={() => {
          boundary.reset()
        }}
      >
        <Suspense fallback={<LoadingProgress {...props} />}>
          <WeightProgressWidget {...props} />
        </Suspense>
      </ErrorBoundary>
    </WidgetCard>
  )
}

export default WeightProgress
