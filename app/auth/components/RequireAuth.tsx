import LoadingCircle from 'app/components/LoadingCircle'
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
    return <LoadingCircle />
  }

  return <>{children}</>
}

function RequireAuth({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Suspense fallback={<LoadingCircle />}>
      <AuthGateway>{children}</AuthGateway>
    </Suspense>
  )
}

export default RequireAuth
