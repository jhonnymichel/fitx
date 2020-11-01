import React, { useState, ReactNode, PropsWithoutRef } from 'react'
import { Formik, FormikProps } from 'formik'
import * as z from 'zod'

type FormProps<S extends z.ZodType<any, any>> = {
  /** All your form fields */
  children: ReactNode
  /** Text to display in the submit button */
  submitText: string
  schema?: S
  submitClassName?: string
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
  initialValues?: FormikProps<z.infer<S>>['initialValues']
} & Omit<PropsWithoutRef<JSX.IntrinsicElements['form']>, 'onSubmit'> &
  Partial<FormikProps<any>>

type OnSubmitResult = {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = 'FORM_ERROR'

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>): JSX.Element {
  const [formError, setFormError] = useState<string | null>(null)
  return (
    <Formik
      initialValues={initialValues || {}}
      validate={(values) => {
        if (!schema) return
        try {
          schema.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
      onSubmit={async (values, { setErrors }) => {
        const { FORM_ERROR, ...otherErrors } = (await onSubmit(values)) || {}

        if (FORM_ERROR) {
          setFormError(FORM_ERROR)
        }

        if (Object.keys(otherErrors).length > 0) {
          setErrors(otherErrors)
        }
      }}
      {...props}
    >
      {({ handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit} {...props}>
          {/* Form fields supplied as children are rendered here */}
          {children}

          {formError && (
            <div role="alert" style={{ color: 'red' }}>
              {formError}
            </div>
          )}

          <button type="submit" className={props.submitClassName} disabled={isSubmitting}>
            {submitText}
          </button>
        </form>
      )}
    </Formik>
  )
}

export default Form
