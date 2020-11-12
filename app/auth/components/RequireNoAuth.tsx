import LoadingCircle from 'app/components/LoadingCircle'
import { useRouter, useSession } from 'blitz'
import { useEffect } from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

function RequireNoAuth({ children }: { children: React.ReactNode }) {
  const { userId: user, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return (
    <SwitchTransition>
      <CSSTransition key={isLoading || user} classNames="transition-gateway" timeout={200}>
        {isLoading || user ? <LoadingCircle /> : children}
      </CSSTransition>
    </SwitchTransition>
  )
}

export default RequireNoAuth
