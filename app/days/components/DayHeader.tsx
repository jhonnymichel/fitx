import { DateTime } from 'luxon'
import { MouseEvent } from 'react'

function DayHeader({
  currentDay,
  onPrevClick,
  onNextClick,
}: {
  currentDay: Date
  onPrevClick: (e: MouseEvent<HTMLButtonElement>) => void
  onNextClick: (e: MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <div className="flex justify-between w-full mb-6">
      <div className="space-x-1">
        <button className="px-4 text-white bg-teal-600 button" onClick={onPrevClick}>{`<`}</button>
        <button className="px-4 text-white bg-teal-600 button" onClick={onNextClick}>{`>`}</button>
      </div>
      <h1 className="text-2xl text-semibold">
        {DateTime.fromJSDate(currentDay).toLocaleString(DateTime.DATE_MED)}
      </h1>
    </div>
  )
}

export default DayHeader
