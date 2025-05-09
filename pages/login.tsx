import { BlitzPage } from '@blitzjs/next'
import React from 'react'
import Layout from 'src/layouts/Layout'
import { LoginForm } from 'src/auth/components/LoginForm'
import Card from 'src/core/components/Card'

const LoginPage: BlitzPage = () => {
  return (
    <div className="w-full max-w-lg p-4 mx-auto">
      <Card>
        <LoginForm />
      </Card>
    </div>
  )
}

LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>
LoginPage.redirectAuthenticatedTo = '/'

export default LoginPage
