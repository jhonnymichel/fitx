import { useSession } from '@blitzjs/auth'
import { useRouter } from 'next/router'
import LoadingCircle from 'src/components/LoadingCircle'
import { useEffect } from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { userId, isLoading } = useSession({ suspense: false })
  const router = useRouter()

  useEffect(() => {
    if (!userId && !isLoading) {
      if (router.asPath !== '/signup') {
        router.push('/signup')
      }
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
