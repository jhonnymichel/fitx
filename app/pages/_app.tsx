import { AppProps, ErrorComponent, useRouter } from 'blitz'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { queryCache } from 'react-query'
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

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      resetKeys={[router.asPath]}
      onReset={() => {
        // This ensures the Blitz useQuery hooks will automatically refetch
        // data any time you reset the error boundary
        queryCache.resetErrorBoundaries()
      }}
    >
      <SwitchTransition>
        <CSSTransition
          key={getTransitionKey(router.asPath)}
          classNames="transition-gateway"
          timeout={200}
        >
          <div className="flex flex-col justify-center w-full h-full px-2">
            {getLayout(<Component {...pageProps} />)}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
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
