import { Ctx } from 'blitz'
import db, { Prisma } from 'db'
import * as z from 'zod'

type UpdateDayInput = {
  data: Pick<
    Prisma.DayUpdateInput,
    'caloriesBurned' | 'foodCarbs' | 'foodFat' | 'foodProtein' | 'foodCalories'
  >
  date: Date
}

const NoDateAllowed = z
  .object({
    date: z.undefined(),
  })
  .nonstrict()

export default async function updateDay({ date, data }: UpdateDayInput, ctx: Ctx) {
  ctx.session.$authorize()

  NoDateAllowed.parse(data)

  const day = await db.day.update({
    where: { uniqueDatePerUser: { date, userId: ctx.session.userId } },
    data,
  })

  return day
}
