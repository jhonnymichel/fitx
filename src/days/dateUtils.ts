import { DateTime } from 'luxon'

export function getCurrentDay() {
  return DateTime.local().startOf('day').toJSDate()
}

export function getNextDay(date: Date) {
  return DateTime.fromJSDate(date).startOf('day').plus({ days: 1 }).toJSDate()
}

export function getPreviousDay(date: Date) {
  return DateTime.fromJSDate(date).startOf('day').minus({ days: 1 }).toJSDate()
}

export function getCurrentWeekRange(): [Date, Date] {
  const start = DateTime.local().startOf('week')
  const end = start.endOf('week')

  return [start.toJSDate(), end.toJSDate()]
}

export function getPreviousWeekRange(date: Date): [Date, Date] {
  const start = DateTime.fromJSDate(date).minus({ weeks: 1 }).startOf('week')
  const end = start.endOf('week')

  return [start.toJSDate(), end.toJSDate()]
}

export function getNextWeekRange(date: Date): [Date, Date] {
  const start = DateTime.fromJSDate(date).plus({ weeks: 1 }).startOf('week')
  const end = start.endOf('week')

  return [start.toJSDate(), end.toJSDate()]
}

export function getWeekProgress(startDate: Date, endDate: Date, progress = 0): number {
  const now = DateTime.local()
  const start = DateTime.fromJSDate(startDate)
  const end = DateTime.fromJSDate(endDate)
  const dateToCheck = start.plus({ days: progress })

  if (now.toMillis() > end.endOf('day').toMillis()) {
    return 7
  }

  if (now.toMillis() < dateToCheck.endOf('day').toMillis()) {
    return progress
  }

  return getWeekProgress(startDate, endDate, progress + 1)
}
