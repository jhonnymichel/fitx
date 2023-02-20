import Link from 'next/link'
import { useMutation } from '@blitzjs/rpc'
import React from 'react'
import TextField from 'src/components/TextField'
import { Form, FORM_ERROR } from 'src/components/Form'
import login from 'src/auth/mutations/login'
import { Login as LoginInput } from 'src/auth/validations'
import FormTitle from './FormTitle'
import SubmitButton from './SubmitButton'

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = (props: LoginFormProps): JSX.Element => {
  const [loginMutation] = useMutation(login)

  return (
    <div className="space-y-4">
      <FormTitle>
        Welcome back, <br /> Login.
      </FormTitle>

      <Form
        validateOnChange={false}
        className="space-y-4"
        schema={LoginInput}
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values) => {
          try {
            await loginMutation(values)
            props.onSuccess?.()
          } catch (error) {
            if (error.name === 'AuthenticationError') {
              return { [FORM_ERROR]: 'Sorry, those credentials are invalid' }
            } else {
              return {
                [FORM_ERROR]:
                  'Sorry, we had an unexpected error. Please try again. - ' + error.toString(),
              }
            }
          }
        }}
      >
        {({ formError }) => (
          <>
            {formError && (
              <div className="p-2 my-4 text-red-900 bg-red-300 rounded-md">{formError}</div>
            )}
            <TextField name="email" label="Email" placeholder="Email" />
            <TextField name="password" label="Password" placeholder="Password" type="password" />
            <SubmitButton>Login</SubmitButton>
          </>
        )}
      </Form>

      <div style={{ marginTop: '1rem' }}>
        Or
        <Link href="/signup" className="ml-2 text-blue-600 mk2 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
