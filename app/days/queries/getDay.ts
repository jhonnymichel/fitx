import { NotFoundError } from 'blitz'
import { Ctx } from 'blitz'
import db, { Prisma } from 'db'

type GetDayInput = Pick<Prisma.DayFindFirstArgs, 'where'>

export default async function getDay({ where }: GetDayInput, ctx: Ctx) {
  ctx.session.$authorize()

  const day = await db.day.findFirst({ where: { ...where, userId: ctx.session.userId } })

  if (!day) throw new NotFoundError()

  const { id, userId, createdAt, updatedAt, ...dayPayload } = day

  return dayPayload
}

export type DayPayload = Awaited<ReturnType<typeof getDay>>
