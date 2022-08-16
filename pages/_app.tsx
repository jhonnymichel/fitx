import { withBlitz } from 'app/blitz-client'
import { useRouter } from 'next/router'
import { useQueryErrorResetBoundary } from '@blitzjs/rpc'
import { ErrorFallbackProps } from '@blitzjs/next'
import { ErrorComponent } from '@blitzjs/next'
import { ErrorBoundary } from '@blitzjs/next'
import { AppProps } from '@blitzjs/next'
import LoginForm from 'app/auth/components/LoginForm'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import 'focus-visible'
import 'app/styles/index.css'

function getTransitionKey(path) {
  switch (path) {
    case '/signup':
    case '/login':
      return path
    default:
      return 'logged'
  }
}

export default withBlitz(function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()
  const boundary = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      onReset={() => {
        // This ensures the Blitz useQuery hooks will automatically refetch
        // data any time you reset the error boundary
        boundary.reset()
      }}
    >
      <SwitchTransition>
        <CSSTransition
          key={getTransitionKey(router.asPath)}
          classNames="transition-route-change"
          timeout={200}
        >
          <div className="flex flex-col justify-center w-full h-full px-2">
            {getLayout(<Component {...pageProps} />)}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </ErrorBoundary>
  )
})

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error?.name === 'AuthenticationError') {
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error?.name === 'AuthorizationError') {
    return (
      <ErrorComponent
        statusCode={(error as any).statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error?.message || error?.name}
      />
    )
  }
}
