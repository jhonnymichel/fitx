import { DateTime, Duration } from 'luxon'

export type PeriodMode = 'week' | 'month'

export function areDatesSameDay(dateA: Date, dateB: Date) {
  const dateAUTC = DateTime.fromJSDate(dateA).setZone('utc').startOf('day')
  const dateBUTC = DateTime.fromJSDate(dateB).setZone('utc').startOf('day')
  return dateAUTC.equals(dateBUTC)
}

export function getCurrentDay() {
  return DateTime.local().startOf('day').toJSDate()
}

export function getSameDayInUTC(date: Date) {
  return DateTime.fromJSDate(date).setZone('utc', { keepLocalTime: true }).startOf('day').toJSDate()
}

export function getEndOfDay(date: Date) {
  return DateTime.fromJSDate(date).endOf('day').toJSDate()
}

export function getDateInUTC(date: Date) {
  return DateTime.fromJSDate(date).setZone('utc', { keepLocalTime: true }).toJSDate()
}

export function getNextDay(date: Date) {
  return DateTime.fromJSDate(date).startOf('day').plus({ days: 1 }).toJSDate()
}

export function getPreviousDay(date: Date) {
  return DateTime.fromJSDate(date).startOf('day').minus({ days: 1 }).toJSDate()
}

export function getCurrentPeriodRange(mode: PeriodMode = 'week'): [Date, Date] {
  const start = DateTime.local().startOf(mode)
  const end = start.endOf(mode).startOf('day')

  return [start.toJSDate(), end.toJSDate()]
}

export function subtractDays(date: Date, days: number): Date {
  const result = DateTime.fromJSDate(date).minus(Duration.fromObject({ days: days }))

  return result.toJSDate()
}

export function diffInDays(startDate: Date, endDate: Date) {
  const result = DateTime.fromJSDate(startDate)
    .startOf('day')
    .diff(DateTime.fromJSDate(endDate).endOf('day'), ['days'])
    .toObject()
  return Math.ceil(Math.abs(result.days ?? 0))
}

export function getPreviousPeriodRange(date: Date, mode: PeriodMode = 'week'): [Date, Date] {
  const start = DateTime.fromJSDate(date).minus({ weeks: 1 }).startOf(mode)
  const end = start.endOf(mode).startOf('day')

  return [start.toJSDate(), end.toJSDate()]
}

export function getNextPeriodRange(date: Date, mode: PeriodMode = 'week'): [Date, Date] {
  const start = DateTime.fromJSDate(date)
    .plus({ [`${mode}s`]: 1 })
    .startOf(mode)
  const end = start.endOf(mode).startOf('day')

  return [start.toJSDate(), end.toJSDate()]
}

export function getPeriodProgress(startDate: Date, endDate: Date, progress = 0): number {
  const now = DateTime.local()
  const start = DateTime.fromJSDate(startDate)
  const end = DateTime.fromJSDate(endDate)
  const dateToCheck = start.plus({ days: progress })

  if (now.toMillis() > end.endOf('day').toMillis()) {
    return diffInDays(startDate, endDate)
  }

  if (now.toMillis() < dateToCheck.endOf('day').toMillis()) {
    return progress
  }

  return getPeriodProgress(startDate, endDate, progress + 1)
}
