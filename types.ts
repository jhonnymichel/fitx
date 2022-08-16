import { SessionContext } from '@blitzjs/auth'
import { SimpleRolesIsAuthorized } from '@blitzjs/auth'
import { User } from 'db'

export type Role = 'admin' | 'user'

declare module '@blitzjs/auth' {
  export interface Ctx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User['id']
      role: Role
    }
  }
}
