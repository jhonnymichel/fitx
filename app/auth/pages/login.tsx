import React from 'react'
import { useRouter, BlitzPage } from 'blitz'
import Layout from 'app/layouts/Layout'
import { LoginForm } from 'app/auth/components/LoginForm'
import Card from 'app/components/Card'
import RequireNoAuth from 'app/auth/components/RequireNoAuth'

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <RequireNoAuth>
      <div className="w-full max-w-lg p-4 mx-auto">
        <Card>
          <LoginForm onSuccess={() => router.push('/')} />
        </Card>
      </div>
    </RequireNoAuth>
  )
}

LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
