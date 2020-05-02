import React, { useContext } from "react"
import { ErrorContext } from "./contexts/ErrorContext"
import Popup from "./Popup"
import { Base, Header } from "./Typography/Typography.style"
import StyledError from "./Error.style"

const Error = () => {
  const { errors, resetErrors } = useContext(ErrorContext)
  const dismiss = () => resetErrors()

  return (
    <Popup show={errors.length > 0} dismiss={dismiss} dismissible={true}>
      <StyledError className="errors box box--warn">
        <Header centered size={2}>
          Error
        </Header>
        {errors &&
          errors.map((error) => {
            const errorType = Object.keys(error)[0]
            const errorTexts = error[errorType]

            return errorTexts.map((errorText) => (
              <Base key={`error${errorType}`}>
                {errorType}: {errorText}
              </Base>
            ))
          })}
      </StyledError>
    </Popup>
  )
}

export default Error
