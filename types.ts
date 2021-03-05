import { DefaultCtx, SessionContext } from 'blitz'
import { SimpleRolesIsAuthorized } from 'blitz'
import { User } from 'db'

export type Role = 'admin' | 'user'

declare module 'blitz' {
  export interface Ctx extends DefaultCtx {
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
