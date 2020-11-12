import LoadingCircle from 'app/components/LoadingCircle'
import { useRouter, useSession } from 'blitz'
import { useEffect } from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { userId, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!userId && !isLoading) {
      router.push('/signup')
    }
  }, [userId, isLoading, router])

  return (
    <SwitchTransition>
      <CSSTransition key={userId} classNames="transition-gateway" timeout={200}>
        {!userId ? <LoadingCircle /> : children}
      </CSSTransition>
    </SwitchTransition>
  )
}

export default RequireAuth
