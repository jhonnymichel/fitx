import { Ctx } from 'blitz'
import db, { DayUpdateArgs } from 'db'

type UpdateDayInput = Pick<DayUpdateArgs, 'where' | 'data'>

export default async function updateDay({ where, data }: UpdateDayInput, ctx: Ctx) {
  ctx.session.authorize()

  const day = await db.day.update({ where, data })

  return day
}
