'use client'

import { BlitzPage } from '@blitzjs/next'
import { useRouter } from 'next/navigation'
import { SignupForm } from 'src/auth/components/SignupForm'
import Card from 'src/components/Card'

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card>
        <SignupForm onSuccess={() => router.push('/')} />
      </Card>
    </div>
  )
}

export default SignupPage
