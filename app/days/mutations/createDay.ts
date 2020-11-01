import { Ctx } from 'blitz'
import db, { DayCreateArgs } from 'db'

type CreateDayInput = Pick<DayCreateArgs, 'data'>
export default async function createDay({ data }: CreateDayInput, ctx: Ctx) {
  ctx.session.authorize()

  const day = await db.day.create({ data })

  return day
}
