import React from 'react'

type RenderDayPayload = { date: Date; padding?: boolean }

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
          <div
            key={day.date.getUTCMilliseconds()}
            className="overflow-hidden bg-neutral-100 aspect-square"
          >
            {renderDay(day)}
          </div>
        ))}
      </div>
    </div>
  )
}

function getDaysInMonthGrid(year: number, month: number): RenderDayPayload[] {
  const firstDayOfWeek = 1 // monday. 0 = sunday.
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const days: { date: Date; padding?: boolean }[] = []

  const startDayOfWeek = firstDayOfMonth.getDay() // Sunday = 0
  const daysInMonth = lastDayOfMonth.getDate()

  // Previous month's trailing days
  for (let i = startDayOfWeek - 1; i >= firstDayOfWeek; i--) {
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
