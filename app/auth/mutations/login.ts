import { Ctx } from 'blitz'
import { authenticateUser } from 'app/auth/auth-utils'
import { Login as LoginInput } from '../validations'
import { Role } from 'types'

export default async function login(input: { email: string; password: string }, { session }: Ctx) {
  // This throws an error if input is invalid
  const { email, password } = LoginInput.parse(input)

  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password)

  await session.$create({ userId: user.id, role: user.role as Role })

  return user
}
