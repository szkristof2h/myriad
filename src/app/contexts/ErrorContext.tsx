import React, { createContext, useState } from 'react';

export interface Error {
  [type: string]: string[]
}

interface ErrorContextInterface {
  errors: Error[]
  addError: (error: string | Error, type?: string) => void
  removeErrors: (error: string[], type?: string) => void
  resetErrors: () => void
}


const initialState: ErrorContextInterface = {
  errors: [],
  addError: error => {},
  removeErrors: errors => {},
  resetErrors: () => {},
}

const ErrorContext = createContext<ErrorContextInterface>(initialState)

const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState<Error[]>([])

  const addError: ErrorContextInterface["addError"] = (
    error,
    type = "uncategorized"
  ) => {
    const existingErrors = errors[type] ?? []
    const newError = typeof error === "string" ? [error] : error[type]

    setErrors({
      ...errors,
      [type]: [
        ...existingErrors,
        ...newError.filter(e => !existingErrors.includes(e)),
      ],
    })
  }

  const removeErrors = (errorsToRemove: string[]) => {
    setErrors(
      errors.filter(
        error =>
          error[Object.keys(error)[0]].filter(e => !errorsToRemove.includes(e))
            .length
      )
    )
  }

  const resetErrors = () => {
    setErrors([])
  }

  return (
    <ErrorContext.Provider
      value={{ errors, addError, removeErrors, resetErrors }}
    >
      {children}
    </ErrorContext.Provider>
  )
}

export { ErrorProvider, ErrorContext };
