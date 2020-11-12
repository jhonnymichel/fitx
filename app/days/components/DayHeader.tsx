import Nav from 'app/components/Nav'
import { DateTime } from 'luxon'
import { MouseEvent } from 'react'

function NavButton({ onClick, children }) {
  return (
    <button className="px-4 text-white bg-teal-600 button" onClick={onClick}>
      {children}
    </button>
  )
}

type DayHeaderProps = {
  currentDay: Date
  onPrevClick: (e: MouseEvent<HTMLButtonElement>) => void
  onNextClick: (e: MouseEvent<HTMLButtonElement>) => void
}

function DayHeader({ currentDay, onPrevClick, onNextClick }: DayHeaderProps) {
  return (
    <div className="flex justify-between w-full mb-6">
      <div className="space-x-1">
        <NavButton onClick={onPrevClick}>{`<`}</NavButton>
        <NavButton onClick={onNextClick}>{`>`}</NavButton>
      </div>
      <h1 className="text-2xl text-semibold">
        {DateTime.fromJSDate(currentDay).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
      </h1>
    </div>
  )
}

export default DayHeader
