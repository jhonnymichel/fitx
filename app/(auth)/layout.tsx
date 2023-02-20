import { useAuthenticatedAppSession } from 'src/blitz-server'

async function AuthLayout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedAppSession({
    redirectAuthenticatedTo: '/',
  })

  return children
}

export default AuthLayout
