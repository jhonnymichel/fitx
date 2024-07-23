import { Ctx } from 'blitz'
import db, { Prisma } from 'db'
import * as z from 'zod'

type UpsertDay = {
  data: Omit<
    Prisma.DayCreateArgs['data'],
    | 'date'
    | 'userId'
    | 'id'
    | 'cardioType'
    | 'cardioCount'
    | 'strengthDone'
    | 'strengthType'
    | 'userGoalsId'
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
      id: true,
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
        connect: {
          id: goals.id,
        },
      },
    },
    update: {
      ...data,
    },
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

  return day
}
