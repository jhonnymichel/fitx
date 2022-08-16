import { BlitzPage } from '@blitzjs/next'
import { useRouter } from 'next/router'
import React from 'react'
import Layout from 'app/layouts/Layout'
import { LoginForm } from 'app/auth/components/LoginForm'
import Card from 'app/components/Card'
import RequireNoAuth from 'app/auth/components/RequireNoAuth'

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <RequireNoAuth>
      <div className="w-full max-w-lg mx-auto">
        <Card>
          <LoginForm onSuccess={() => router.push('/')} />
        </Card>
      </div>
    </RequireNoAuth>
  )
}

LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
