import { fix } from 'src/days/getScore'

function getScoreTitle(score: number, noData?: boolean) {
  if (noData) {
    return 'NO DATA'
  }

  if (score <= 5) {
    return 'AWFUL'
  }

  if (score <= 6) {
    return 'OK.'
  }

  if (score <= 7) {
    return 'GOOD'
  }

  if (score <= 8) {
    return 'GREAT'
  }

  if (score <= 9) {
    return 'AMZNG'
  }

  return 'PRFCT'
}

function getScore(score: number, noData?: boolean) {
  if (noData) {
    return '?'
  }

  return Math.min(10, fix(score))
}

function LoadingTitle() {
  return (
    <div className="ph-item">
      <div className="flex flex-col justify-end w-full h-full space-y-1">
        <div className="space-y-1 ph-row">
          <div className="ph-col-6" style={{ height: '3rem' }}></div>
        </div>
      </div>
    </div>
  )
}

function LoadingComment() {
  return (
    <div>
      <div className="w-full py-1 ph-item">
        <div className="flex flex-col justify-end w-full h-full space-y-1">
          <div className="space-y-1 ph-row">
            <div className="ph-col-8"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

type OverralScoreProps = {
  title: string
  score: number
  comment: string
  isLoading?: boolean
  noData?: boolean
}

function OverallScore({ title, score, comment, isLoading, noData }: OverralScoreProps) {
  return (
    <footer className="flex items-center justify-between w-full space-x-2">
      <div className="w-full">
        <h1>
          <span className="block text-xs font-semibold text-neutral-600 uppercase xl:text-sm">
            {title}
          </span>
          {isLoading ? (
            <LoadingTitle />
          ) : (
            <span className="block text-4xl font-semibold uppercase xl:text-5xl">
              {getScoreTitle(score, noData)}
            </span>
          )}
        </h1>
        {isLoading ? <LoadingComment /> : <p className="text-xs xl:text-sm">{comment}</p>}
      </div>
      <div className="flex items-center justify-center shrink-0 w-24 h-24 text-5xl font-bold bg-neutral-100 rounded-full xl:w-32 xl:h-32 xl:text-6xl">
        {!isLoading && <h2>{getScore(score, noData)}</h2>}
      </div>
    </footer>
  )
}

export default OverallScore
