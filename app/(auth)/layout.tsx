import { useAuthenticatedAppSession } from '@blitzjs/auth'

async function AuthLayout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedAppSession({
    redirectAuthenticatedTo: '/',
  })

  return children
}

export default AuthLayout
