import React from 'react'
import { Link, useMutation } from 'blitz'
import TextField from 'app/components/TextField'
import { Form, FORM_ERROR } from 'app/components/Form'
import login from 'app/auth/mutations/login'
import { LoginInput } from 'app/auth/validations'
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
        <TextField name="email" label="Email" placeholder="Email" />
        <TextField name="password" label="Password" placeholder="Password" type="password" />
        <SubmitButton>Login</SubmitButton>
      </Form>

      <div style={{ marginTop: '1rem' }}>
        Or <Link href="/signup">Sign Up</Link>
      </div>
    </div>
  )
}

export default LoginForm
