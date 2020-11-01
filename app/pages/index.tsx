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
    <div className="p-4">
      <div className="max-w-md p-4 mx-auto mt-20 bg-white rounded-md shadow-lg">
        <SignupForm />
      </div>
    </div>
  )
}

function Loading(): JSX.Element {
  return <>Loading</>
}

function Index(): JSX.Element {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <AuthGateway />
      </Suspense>
    </div>
  )
}

export default Index
