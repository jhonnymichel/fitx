import React from 'react'

export type RenderDayPayload = { date: Date; padding?: boolean }

type CalendarGridProps = {
  month: number // 0 - 11
  year: number
  renderDay: (day: RenderDayPayload) => React.ReactNode
}

export default function CalendarGrid({ month, year, renderDay }: CalendarGridProps) {
  const days = getDaysInMonthGrid(year, month)

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-7 gap-[2px]">
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
        <div>S</div>
      </div>
      <div className="grid grid-cols-7 gap-[2px] rounded-md bg-neutral-200 overflow-hidde">
        {days.map((day) => (
          <div key={day.date.getTime()} className="overflow-hidden bg-neutral-100 aspect-square">
            {renderDay(day)}
          </div>
        ))}
      </div>
    </div>
  )
}

function getDaysInMonthGrid(year: number, month: number, weekStartOn = 1): RenderDayPayload[] {
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const days: { date: Date; padding?: boolean }[] = []

  const startDayOfWeek = firstDayOfMonth.getDay() // Sunday = 0
  const daysInMonth = lastDayOfMonth.getDate()

  // Normalize offset to handle weekStartOn correctly.
  // We use Date.prototype.getDay() to check what day of the week that current date is at.
  // In JavaScript, Sunday is 0, Monday is 1, ..., Saturday is 6.
  //
  // Our grid can be configured to start either at day 1, Monday, or day 0, Sunday.
  //
  // Let's say we setup the grid to start on Monday, and first day of the displayed month is luckily a Monday:
  // (1 - 1 + 7) % 7 = 0. meaning our first day of the month goes in first index of the grid.
  //
  // Let's say we setup the grid to start on Monday, and first day of the displayed month is a Sunday:
  // (0 - 1 + 7) % 7 = 6. meaning our first day of the month goes at the end of the first row.
  // not only that, but we also need six days in the grid from the previous month before adding the first day of the current month.
  //
  // If grid is setup to start on Sunday, the `weekStartOn` const will have value 0, meaning it'll not affect the equation.
  const offset = (startDayOfWeek - weekStartOn + 7) % 7

  // Previous month's trailing days
  for (let i = offset - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({ date, padding: true })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: new Date(year, month, i) })
  }

  // Fill the rest of the grid to reach full weeks (total multiple of 7)
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), padding: true })
    }
  }

  return days
}
