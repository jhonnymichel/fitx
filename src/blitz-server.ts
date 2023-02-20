import type { BlitzCliConfig } from 'blitz'
import { setupBlitzServer } from '@blitzjs/next'
import { AuthServerPlugin, PrismaStorage } from '@blitzjs/auth'
import { simpleRolesIsAuthorized } from '@blitzjs/auth'
import { BlitzLogger } from 'blitz'
import db from 'db'

const { api, getAppSession, useAuthenticatedAppSession } = setupBlitzServer({
  plugins: [
    AuthServerPlugin({
      cookiePrefix: 'web-cookie-prefix',
      storage: PrismaStorage(db),
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  logger: BlitzLogger({}),
})

export { api, getAppSession, useAuthenticatedAppSession }

export const cliConfig: BlitzCliConfig = {
  customTemplates: 'src/templates',
}
