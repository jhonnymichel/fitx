import { NotFoundError } from 'blitz'
import { Ctx } from 'blitz'
import db from 'db'
import { getSameDayInUTC } from '../dateUtils'

type GetDayInput = { date: Date }
export default async function getDay({ date }: GetDayInput, ctx: Ctx) {
  ctx.session.$authorize()

  const normalizedDate = getSameDayInUTC(date)

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

  if (!day) throw new NotFoundError()

  return day
}

export type DayPayload = Awaited<ReturnType<typeof getDay>>
