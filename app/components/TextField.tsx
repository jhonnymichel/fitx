import React, { PropsWithoutRef } from 'react'
import { useField, useFormikContext, ErrorMessage } from 'formik'
import classNames from 'classnames'

export interface TextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements['input']> {
  /** Field name. */
  name: string
  /** Field label. */
  label?: string
  disabled?: boolean
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: 'text' | 'password' | 'email' | 'number'
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { name, label, outerProps, ...props },
  ref
) {
  const [input, meta] = useField(name)
  const { isSubmitting } = useFormikContext()

  return (
    <div {...outerProps}>
      <label className="flex flex-col">
        {label && <span>{label}</span>}
        <input
          {...input}
          disabled={isSubmitting || props.disabled}
          {...props}
          ref={ref}
          className={classNames(
            'input',
            {
              'border border-red-600': meta.error && meta.touched,
              'border border-gray-300': !meta.error,
            },
            props.className
          )}
        />
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
