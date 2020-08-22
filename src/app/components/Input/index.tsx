import React, { FC } from "react"
import { Error } from "../../Typography/Typography.style"
import StyledInput from "./styles"

interface Props extends React.HTMLProps<HTMLInputElement> {
  hasError?: boolean
  isRequired?: boolean
  maxLength?: number
  message?: string
  minLength?: number
  register?: any
  validate?: Function | Object
}

const Input: FC<Props> = props => {
  const {
    hasError,
    isRequired,
    maxLength,
    message,
    minLength,
    register,
    validate,
    ...rest
  } = props

  return (
    <>
      {register ? (
        <StyledInput
          ref={register({
            required: isRequired,
            maxLength,
            minLength,
            validate,
          })}
          {...rest}
        />
      ) : (
        <StyledInput {...props} />
      )}
      {hasError && <Error>{message}</Error>}
    </>
  )
}

export default Input
