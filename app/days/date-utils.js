import { DateTime } from 'luxon'

export function getCurrentDay() {
  return DateTime.local().startOf('day').toISO()
}
