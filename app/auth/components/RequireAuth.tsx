import { useCurrentUser } from 'app/hooks/useCurrentUser'
import { useRouter } from 'blitz'
import { Suspense, useEffect } from 'react'

function AuthGateway({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/signup')
    }
  }, [user, isLoading, router])

  if (!user) {
    return <Loading />
  }

  return <>{children}</>
}

function Loading() {
  return <>Loading</>
}

function RequireAuth({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Suspense fallback={<Loading />}>
      <AuthGateway>{children}</AuthGateway>
    </Suspense>
  )
}

export default RequireAuth
