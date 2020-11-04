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
