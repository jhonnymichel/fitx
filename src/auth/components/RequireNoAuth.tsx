import { useSession } from '@blitzjs/auth'
import { useRouter } from 'next/router'
import LoadingCircle from 'src/components/LoadingCircle'
import { useEffect } from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

function RequireNoAuth({ children }: { children: React.ReactNode }) {
  const { userId: user, isLoading } = useSession({ suspense: false })
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (router.asPath !== '/') {
        router.push('/')
      }
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
