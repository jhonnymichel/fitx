import React, { useEffect } from 'react'
import { useRouter, BlitzPage } from 'blitz'
import Layout from 'app/layouts/Layout'
import { SignupForm } from 'app/auth/components/SignupForm'
import Card from 'app/components/Card'

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div className="p-4">
      <Card>
        <SignupForm onSuccess={() => router.push('/')} />
      </Card>
    </div>
  )
}

SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
