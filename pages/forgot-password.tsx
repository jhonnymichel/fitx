import { useMutation } from '@blitzjs/rpc'
import { BlitzPage } from '@blitzjs/next'
import Layout from 'src/core/layouts/Layout'
import { LabeledTextField } from 'src/auth/components/LabeledTextField'
import { ForgotPassword } from 'src/auth/validations'
import forgotPassword from 'src/auth/mutations/forgotPassword'
import Form, { FORM_ERROR } from 'src/auth/components/Form'

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)

  return (
    <div>
      <h1>Forgot your password?</h1>

      {isSuccess ? (
        <div>
          <h2>Request Submitted</h2>
          <p>
            If your email is in our system, you will receive instructions to reset your password
            shortly.
          </p>
        </div>
      ) : (
        <Form
          submitText="Send Reset Password Instructions"
          schema={ForgotPassword}
          initialValues={{ email: '' }}
          onSubmit={async (values) => {
            try {
              await forgotPasswordMutation(values)
            } catch (error) {
              return {
                [FORM_ERROR]: 'Sorry, we had an unexpected error. Please try again.',
              }
            }
          }}
        >
          <LabeledTextField name="email" label="Email" placeholder="Email" />
        </Form>
      )}
    </div>
  )
}

ForgotPasswordPage.redirectAuthenticatedTo = '/'
ForgotPasswordPage.getLayout = (page) => <Layout title="Forgot Your Password?">{page}</Layout>

export default ForgotPasswordPage
