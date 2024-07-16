import { NotFoundError } from 'blitz'
import { Ctx } from 'blitz'
import db, { Prisma } from 'db'

type GetDayInput = Pick<Prisma.DayFindFirstArgs, 'where'>

export default async function getDay({ where }: GetDayInput, ctx: Ctx) {
  ctx.session.$authorize()
  const day = await db.day.findFirst({
    where: { ...where, userId: ctx.session.userId },
    select: {
      date: true,
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
