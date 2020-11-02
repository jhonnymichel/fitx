import { Link, BlitzPage, useMutation, useRouter } from 'blitz'
import Layout from 'app/layouts/Layout'
import logout from 'app/auth/mutations/logout'
import { useCurrentUser } from 'app/hooks/useCurrentUser'
import SignupForm from 'app/auth/components/SignupForm'
import { Suspense, useEffect } from 'react'

function AuthGateway() {
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

  return (
    <div className="p-4">
      <div className="max-w-md p-4 mx-auto mt-20 bg-white rounded-md shadow-lg">Logadomon!</div>
    </div>
  )
}

function Loading() {
  return <>Loading</>
}

function Index(): JSX.Element {
  return (
    <Suspense fallback={<Loading />}>
      <AuthGateway />
    </Suspense>
  )
}

export default Index
