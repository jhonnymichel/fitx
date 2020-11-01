import React from 'react'
import { useMutation } from 'blitz'
import { Form, FORM_ERROR } from 'app/components/Form'
import signup from 'app/auth/mutations/signup'
import { SignupInput } from 'app/auth/validations'
import LabeledTextField from 'app/components/TextField'
import classNames from 'classnames'

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps): JSX.Element => {
  const [signupMutation] = useMutation(signup)

  return (
    <div className="space-y-4">
      <h1 className="text-5xl font-bold text-left text-gray-400">Create an Account.</h1>

      <Form
        validateOnBlur={false}
        validateOnChange={false}
        className="space-y-4"
        submitText="Create Account"
        submitClassName={classNames(
          'button',
          'block ml-auto bg-green-400 hover:bg-green-500 text-white'
        )}
        schema={SignupInput}
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()
          } catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
              // This error comes from Prisma
              return { email: 'This email is already being used' }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
      </Form>
    </div>
  )
}

export default SignupForm
