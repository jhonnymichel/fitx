import { Link, BlitzPage, useMutation } from 'blitz'
import Layout from 'app/layouts/Layout'
import logout from 'app/auth/mutations/logout'
import { useCurrentUser } from 'app/hooks/useCurrentUser'
import { Suspense } from 'react'
import SignupForm from 'app/auth/components/SignupForm'

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

function AuthGateway(): JSX.Element {
  const user = useCurrentUser()
  if (user) {
    return <>É man, tá logado</>
  }

  return (
    <>
      Oi
      <SignupForm />
    </>
  )
}

function Loading(): JSX.Element {
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
