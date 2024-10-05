import { Ctx } from 'blitz'
import db from 'db'
import { getSameDayInUTC } from '../dateUtils'

type GetDayInput = { date: Date }
export default async function getDay({ date }: GetDayInput, ctx: Ctx) {
  ctx.session.$authorize()

  const normalizedDate = getSameDayInUTC(date)
  const bodyMetrics = await db.bodyMetrics.findFirst({
    where: {
      userId: ctx.session.userId,
      date: { lte: date },
    },
  })

  const day = await db.day.findFirst({
    where: { date: { equals: normalizedDate }, userId: ctx.session.userId },
    select: {
      date: true,
      caloriesBurned: true,
      foodCalories: true,
      foodCarbs: true,
      foodProtein: true,
      foodFat: true,
      goals: true,
    },
  })

  return { day, bodyMetrics }
}

export type DayPayload = Awaited<ReturnType<typeof getDay>>
