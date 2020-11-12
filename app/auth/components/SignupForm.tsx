import React from 'react'
import { Link, useMutation } from 'blitz'
import { Form, FORM_ERROR } from 'app/components/Form'
import signup from 'app/auth/mutations/signup'
import { SignupInput } from 'app/auth/validations'
import LabeledTextField from 'app/components/TextField'
import FormTitle from './FormTitle'
import SubmitButton from './SubmitButton'

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  return (
    <div className="space-y-4">
      <FormTitle>
        Create <br /> an Account.
      </FormTitle>

      <Form
        validateOnChange={false}
        className="space-y-4"
        schema={SignupInput}
        initialValues={{ email: '', password: '', name: '' }}
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
        <LabeledTextField name="name" label="Name" placeholder="Name" />
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        <p className="text-sm">
          Please reckon that there is currently no way to recover your account if you forget your
          password.
        </p>
        <div className="flex items-start">
          <div className="flex flex-wrap">
            Already have an account?
            <Link href="/login">
              <a className="ml-1 text-blue-600 hover:underline">Sign in</a>
            </Link>
          </div>
          <SubmitButton>Create account</SubmitButton>
        </div>
      </Form>
    </div>
  )
}

export default SignupForm
