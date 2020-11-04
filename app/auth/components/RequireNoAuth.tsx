import { useRouter, useSession } from 'blitz'
import { Suspense, useEffect } from 'react'

function AuthGateway({ children }: { children: React.ReactNode }) {
  const { userId: user, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  if (isLoading || user) {
    return <Loading />
  }

  return <>{children}</>
}

function Loading() {
  return <>Loading</>
}

function RequireNoAuth({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Suspense fallback={<Loading />}>
      <AuthGateway>{children}</AuthGateway>
    </Suspense>
  )
}

export default RequireNoAuth
