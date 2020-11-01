import classNames from 'classnames'
import { useFormikContext } from 'formik'

function SubmitButton({ children }: { children: React.ReactNode }): JSX.Element {
  const { isSubmitting } = useFormikContext()

  return (
    <button
      type="submit"
      className={classNames('button', 'block ml-auto bg-green-400 hover:bg-green-500 text-white')}
      disabled={isSubmitting}
    >
      {children}
    </button>
  )
}

export default SubmitButton
