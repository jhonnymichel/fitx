import React, { PropsWithoutRef } from 'react'
import { useField, useFormikContext, ErrorMessage } from 'formik'

export interface TextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements['input']> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: 'text' | 'password' | 'email' | 'number'
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { name, label, outerProps, ...props },
  ref
) {
  const [input] = useField(name)
  const { isSubmitting } = useFormikContext()

  return (
    <div {...outerProps}>
      <label>
        {label}
        <input {...input} disabled={isSubmitting} {...props} ref={ref} />
      </label>

      <ErrorMessage name={name}>
        {(msg) => (
          <div role="alert" style={{ color: 'red' }}>
            {msg}
          </div>
        )}
      </ErrorMessage>
    </div>
  )
})

export default TextField
