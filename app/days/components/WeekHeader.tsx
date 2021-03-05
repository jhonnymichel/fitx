import NavButton from 'app/components/NavButton'
import { DateTime } from 'luxon'
import { MouseEvent } from 'react'

type WeekHeaderProps = {
  weekRange: [Date, Date]
  onPrevClick: (e: MouseEvent<HTMLButtonElement>) => void
  onNextClick: (e: MouseEvent<HTMLButtonElement>) => void
}

function WeekHeader({ weekRange, onPrevClick, onNextClick }: WeekHeaderProps) {
  const [start, end] = weekRange
  return (
    <div className="flex justify-between w-full mb-6">
      <div className="space-x-1">
        <NavButton onClick={onPrevClick}>{`<`}</NavButton>
        <NavButton onClick={onNextClick}>{`>`}</NavButton>
      </div>
      <h1 className="text-2xl text-semibold">
        {DateTime.fromJSDate(start).toLocaleString(DateTime.DATE_MED)}
        {' - '}
        {DateTime.fromJSDate(end).toLocaleString(DateTime.DATE_MED)}
      </h1>
    </div>
  )
}

export default WeekHeader
