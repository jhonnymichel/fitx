import { Ctx } from 'blitz'
import db, { Prisma } from 'db'
import * as z from 'zod'

type UpsertDay = {
  data: Omit<
    Prisma.DayCreateArgs['data'],
    'date' | 'userId' | 'id' | 'cardioType' | 'cardioCount' | 'strengthDone' | 'strengthType'
  >
  date: Date
}

const NoDateAllowed = z
  .object({
    date: z.undefined(),
  })
  .nonstrict()

export default async function upsertDay({ date, data }: UpsertDay, ctx: Ctx) {
  ctx.session.$authorize()

  NoDateAllowed.parse(data)

  const goals = await db.userGoals.findFirstOrThrow({
    where: { userId: ctx.session.userId },
    select: {
      foodCalories: true,
      foodCaloriesType: true,
      foodCarbs: true,
      foodCarbsType: true,
      foodFat: true,
      foodFatType: true,
      foodProtein: true,
      foodProteinType: true,
    },
  })

  const day = await db.day.upsert({
    where: { uniqueDatePerUser: { date, userId: ctx.session.userId } },
    create: {
      date,
      ...data,
      user: {
        connect: {
          id: ctx.session.userId,
        },
      },
      goals: {
        create: {
          ...goals,
        },
      },
    },
    update: data,
  })

  return day
}
