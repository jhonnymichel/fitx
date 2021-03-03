import { Ctx } from 'blitz'
import db from 'db'
import { hashPassword } from 'app/auth/auth-utils'
import { Signup as SignupInput } from 'app/auth/validations'
import { Role } from 'types'

export default async function signup(input, { session }: Ctx) {
  // This throws an error if input is invalid
  const { email, password, name } = SignupInput.parse(input)

  const hashedPassword = await hashPassword(password)
  const user = await db.user.create({
    data: { email: email.toLowerCase(), name, hashedPassword, role: 'user' },
    select: { id: true, name: true, email: true, role: true },
  })

  await session.$create({ userId: user.id, role: user.role as Role })

  return user
}
