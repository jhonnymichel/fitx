import { fix } from 'app/days/get-score'

function getScoreTitle(score: number) {
  if (score === 0) {
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

function OverallScore({ title, score, comment }) {
  return (
    <footer className="flex items-center justify-between w-full md:py-8">
      <div>
        <h1>
          <span className="block text-sm font-semibold text-gray-600 uppercase">{title}</span>
          <span className="block text-5xl font-semibold uppercase">{getScoreTitle(score)}</span>
        </h1>
        <p className="text-sm">{comment}</p>
      </div>
      <div className="flex items-center justify-center flex-shrink-0 w-32 h-32 text-6xl font-bold bg-gray-200 rounded-full">
        <h2>{Math.min(10, fix(score)) || '?'}</h2>
      </div>
    </footer>
  )
}

export default OverallScore
