import { FallbackProps } from 'react-error-boundary'

function ErrorMessage({ error, resetErrorBoundary: retry }: Partial<FallbackProps>) {
  return (
    <>
      gave bad: {error?.name} - {error?.message}{' '}
      {retry && (
        <button
          onClick={() => {
            retry
          }}
        >
          Retry
        </button>
      )}
    </>
  )
}

export default ErrorMessage
