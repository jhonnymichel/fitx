import { Ctx } from 'blitz'
import db from 'db'
import { getEndOfDay, getSameDayInUTC } from '../../core/dateUtils'

type GetDayInput = { date: Date }
export default async function getDay({ date }: GetDayInput, ctx: Ctx) {
  ctx.session.$authorize()

  const normalizedDate = getSameDayInUTC(date)
  const [currentMetrics, previousMetrics] = await db.bodyMetrics.findMany({
    where: {
      userId: ctx.session.userId,
      date: { lte: getEndOfDay(normalizedDate) },
    },
    orderBy: {
      date: 'desc',
    },
    take: 2,
  })

  const bodyMetrics = currentMetrics
    ? {
        ...currentMetrics,
        weightDelta:
          currentMetrics && previousMetrics
            ? currentMetrics.weightInKilograms - previousMetrics?.weightInKilograms
            : null,
      }
    : null

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
