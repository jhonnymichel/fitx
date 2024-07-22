import { useQuery, useQueryErrorResetBoundary } from '@blitzjs/rpc'
import getRangeSummary from '../queries/getRangeSummary'
import { ErrorBoundary, ErrorFallbackProps } from '@blitzjs/next'
import { Suspense } from 'react'

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

  return <div className="space-y-3">{JSON.stringify(data, null, 2)}</div>
}

function RangeSummary(props: RangeSummaryProps) {
  const boundary = useQueryErrorResetBoundary()

  return (
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
  )
}

export default RangeSummary
