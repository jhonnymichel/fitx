import { useCurrentUser } from 'app/hooks/useCurrentUser'
import { useRouter } from 'blitz'
import { Suspense, useEffect } from 'react'

function AuthGateway({ children, backTo = '/' }: { children: React.ReactNode; backTo: string }) {
  const { user, isLoading } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push(backTo)
    }
  }, [user, router, isLoading, backTo])

  if (isLoading || user) {
    return <Loading />
  }

  return <>{children}</>
}

function Loading() {
  return <>Loading</>
}

function RequireNoAuth({
  children,
  backTo = '/',
}: {
  children: React.ReactNode
  backTo: string
}): JSX.Element {
  return (
    <Suspense fallback={<Loading />}>
      <AuthGateway backTo={backTo}>{children}</AuthGateway>
    </Suspense>
  )
}

export default RequireNoAuth
