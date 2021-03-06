import logout from 'app/auth/mutations/logout'
import { useCurrentUser } from 'app/hooks/useCurrentUser'
import { useMutation } from 'blitz'
import { Suspense, useEffect, useState } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { queryCache } from 'react-query'

function Info() {
  const { user } = useCurrentUser()

  return <>Hey, {user?.name}!</>
}

function ErrorLoadingInfo({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="text-red-800">
      Error loading user info{' '}
      <button
        className="text-black bg-gray-200 button hover:bg-gray-400"
        onClick={resetErrorBoundary}
      >
        retry
      </button>
    </div>
  )
}

function Loading() {
  return (
    <div className="self-center ph-item">
      <div>
        <div className="ph-row">
          <div className="ph-col-6"></div>
        </div>
      </div>
    </div>
  )
}

function UserBar() {
  const [performLogout] = useMutation(logout)
  return (
    <div className="flex items-end justify-between flex-shrink-0 w-full max-w-lg mt-2">
      <ErrorBoundary
        FallbackComponent={ErrorLoadingInfo}
        onReset={() => {
          queryCache.resetErrorBoundaries()
        }}
      >
        <Suspense fallback={<Loading />}>
          <Info />
        </Suspense>
      </ErrorBoundary>
      <button className="text-blue-600 hover:underline" onClick={performLogout}>
        logout
      </button>
    </div>
  )
}

export default UserBar
