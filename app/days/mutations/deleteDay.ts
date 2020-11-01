import { Ctx } from 'blitz'
import db, { Day, DayDeleteArgs } from 'db'

type DeleteDayInput = Pick<DayDeleteArgs, 'where'>

export default async function deleteDay({ where }: DeleteDayInput, ctx: Ctx): Promise<Day> {
  ctx.session.authorize()

  const day = await db.day.delete({ where })

  return day
}
