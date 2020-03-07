import React, { FC, ChangeEvent } from "react"
import StyledTextArea from "./styles"

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  value?: string
  rows?: string
  placeholder?: string
}

const TextArea:FC<Props> = props => {

  return <StyledTextArea {...props} />
}

export default TextArea
