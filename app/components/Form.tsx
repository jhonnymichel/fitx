import React, { useState, ReactNode, PropsWithoutRef, useContext, Context } from 'react'
import { Formik, Form as FormikForm, FormikProps } from 'formik'
import * as z from 'zod'

type FormProps<S extends z.ZodType<any, any>> = {
  /** All your form fields */
  children: ReactNode
  schema?: S
  className?: string
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
  initialValues?: FormikProps<z.infer<S>>['initialValues']
} & Omit<PropsWithoutRef<JSX.IntrinsicElements['form']>, 'onSubmit'> &
  Partial<FormikProps<any>>

type OnSubmitResult = {
  FORM_ERROR?: string
  [prop: string]: any
}

const FormErrorContext = React.createContext<string | null>(null)

export const useFormError = (): string | null => {
  return useContext(FormErrorContext)
}

export const FORM_ERROR = 'FORM_ERROR'

export function Form<S extends z.ZodType<any, any>>({
  children,
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
      {(formikBag) => (
        <FormErrorContext.Provider value={formError}>
          <FormikForm className={props.className}>
            {typeof children === 'function' ? children({ ...formikBag, formError }) : children}
          </FormikForm>
        </FormErrorContext.Provider>
      )}
    </Formik>
  )
}

export default Form
