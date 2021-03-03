import { Ctx, NotFoundError } from 'blitz'
import db, { FindFirstDayArgs } from 'db'

type GetDayInput = Pick<FindFirstDayArgs, 'where'>

export default async function getDay({ where }: GetDayInput, ctx: Ctx) {
  ctx.session.$authorize()

  const day = await db.day.findFirst({ where: { ...where, userId: ctx.session.userId } })

  if (!day) throw new NotFoundError()

  return day
}
