import React, { FC, CSSProperties } from "react"
import StyledButton from "./styles"

export interface Props {
  buttonType: "confirm" | "danger" | "primary"
  href?: string
  isActive?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  placeholder?: string
  style?: CSSProperties
  type?: string
  value?: string
}

const Button: FC<Props> = props => {
  return <StyledButton {...props} />
}

export default Button
