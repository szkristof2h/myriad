import React, { FC, ChangeEvent } from "react"
import StyledInput from "./styles"

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  value?: string
  className?: string
  placeholder?: string
}

const Input:FC<Props> = props => {

  return <StyledInput {...props} />
}

export default Input
