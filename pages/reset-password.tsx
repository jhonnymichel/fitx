import Link from 'next/link'
import { useMutation } from '@blitzjs/rpc'
import { useRouter } from 'next/router'
import { BlitzPage } from '@blitzjs/next'
import Layout from 'src/core/layouts/Layout'
import { LabeledTextField } from 'src/auth/components/LabeledTextField'
import { Form, FORM_ERROR } from 'src/auth/components/Form'
import { ResetPassword } from 'src/auth/validations'
import resetPassword from 'src/auth/mutations/resetPassword'

const ResetPasswordPage: BlitzPage = () => {
  const query = useRouter().query
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)

  return (
    <div>
      <h1>Set a New Password</h1>

      {isSuccess ? (
        <div>
          <h2>Password Reset Successfully</h2>
          <p>
            Go to the <Link href="/">homepage</Link>
          </p>
        </div>
      ) : (
        <Form
          submitText="Reset Password"
          schema={ResetPassword}
          initialValues={{ password: '', passwordConfirmation: '', token: '' }}
          onSubmit={async (values) => {
            try {
              await resetPasswordMutation({ ...values, token: query.token as string })
            } catch (error) {
              if (error.name === 'ResetPasswordError') {
                return {
                  [FORM_ERROR]: error.message,
                }
              } else {
                return {
                  [FORM_ERROR]: 'Sorry, we had an unexpected error. Please try again.',
                }
              }
            }
          }}
        >
          <LabeledTextField name="password" label="New Password" type="password" />
          <LabeledTextField
            name="passwordConfirmation"
            label="Confirm New Password"
            type="password"
          />
        </Form>
      )}
    </div>
  )
}

ResetPasswordPage.redirectAuthenticatedTo = '/'
ResetPasswordPage.getLayout = (page) => <Layout title="Reset Your Password">{page}</Layout>

export default ResetPasswordPage
