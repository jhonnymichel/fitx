import { BlitzPage } from '@blitzjs/next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Layout from 'src/layouts/Layout'
import { SignupForm } from 'src/auth/components/SignupForm'
import Card from 'src/components/Card'

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div className="w-full max-w-lg p-4 mx-auto">
      <Card>
        <SignupForm onSuccess={() => router.push('/')} />
      </Card>
    </div>
  )
}

SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>
SignupPage.redirectAuthenticatedTo = '/'

export default SignupPage
