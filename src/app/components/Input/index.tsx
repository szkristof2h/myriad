import React, { FC, ChangeEvent } from "react"
import StyledInput from "./styles"

interface Props extends React.HTMLProps<HTMLInputElement> {}

const Input: FC<Props> = props => {
  return <StyledInput {...props} />
}

export default Input
