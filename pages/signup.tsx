import { BlitzPage } from '@blitzjs/next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Layout from 'app/layouts/Layout'
import { SignupForm } from 'app/auth/components/SignupForm'
import Card from 'app/components/Card'
import RequireNoAuth from 'app/auth/components/RequireNoAuth'

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <RequireNoAuth>
      <div className="w-full max-w-lg mx-auto">
        <Card>
          <SignupForm onSuccess={() => router.push('/')} />
        </Card>
      </div>
    </RequireNoAuth>
  )
}

SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
