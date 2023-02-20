'use client'

import { BlitzPage } from '@blitzjs/next'
import { useRouter } from 'next/navigation'
import { LoginForm } from 'src/auth/components/LoginForm'
import Card from 'src/components/Card'

const LoginPage = () => {
  const router = useRouter()

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card>
        <LoginForm onSuccess={() => router.push('/')} />
      </Card>
    </div>
  )
}

export default LoginPage
