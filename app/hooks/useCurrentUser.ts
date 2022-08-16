import { useSession } from '@blitzjs/auth'
import { useQuery } from '@blitzjs/rpc'
import getCurrentUser from 'app/users/queries/getCurrentUser'

export const useCurrentUser = () => {
  // We wouldn't have to useSession() here, but doing so improves perf on initial
  // load since we can skip the getCurrentUser() request.
  const session = useSession({ suspense: false })
  const [user] = useQuery(getCurrentUser, null, {
    enabled: !!session.userId,
    retry: 3,
  })

  return { user: session.userId ? user : null, isLoading: session.isLoading }
}
