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
