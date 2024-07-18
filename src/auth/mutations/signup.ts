import { SecurePassword } from '@blitzjs/auth/secure-password'
import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { Signup } from 'src/auth/validations'
import { Role } from 'types'

export default resolver.pipe(resolver.zod(Signup), async ({ email, password, name }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password)
  const user = await db.user.create({
    data: {
      email: email.toLowerCase(),
      hashedPassword,
      name,
      role: 'USER',
      goals: {
        create: {},
      },
    },
    select: { id: true, name: true, email: true, role: true },
  })

  await ctx.session.$create({ userId: user.id, role: user.role as Role })
  return user
})
