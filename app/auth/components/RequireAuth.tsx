import { useRouter, useSession } from 'blitz'
import { Suspense, useEffect } from 'react'

function AuthGateway({ children }: { children: React.ReactNode }) {
  const { userId, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!userId && !isLoading) {
      router.push('/signup')
    }
  }, [userId, isLoading, router])

  if (!userId) {
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
