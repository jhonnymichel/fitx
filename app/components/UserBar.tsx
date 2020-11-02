import logout from 'app/auth/mutations/logout'
import { useCurrentUser } from 'app/hooks/useCurrentUser'
import { useMutation } from 'blitz'
import { Suspense } from 'react'

function Info() {
  const { user } = useCurrentUser()
  const [performLogout] = useMutation(logout)

  return (
    <div>
      {user?.name}
      <button className="button" onClick={performLogout}>
        logout
      </button>
    </div>
  )
}

function UserBar() {
  return (
    <Suspense fallback={<>Loading</>}>
      <Info />
    </Suspense>
  )
}

export default UserBar
