import React, { FC, ReactNode, CSSProperties } from "react"
import StyledButton from "./styles"

export interface Props {
  isActive?: boolean
  as?: ReactNode
  className?: string
  placeholder?: string
  href?: string
  isDisabled?: boolean
  isLoading?: boolean
  onClick?: (e: React.MouseEvent) => void
  isRated?: boolean // used only for rating buttons, might be unnecessary
  style?: CSSProperties
  to?: string
  type:
    | "arrow"
    | "confirm"
    | "danger"
    | "google"
    | "impressed"
    | "impressedBig"
    | "meh"
    | "mehBig"
    | "primary"
    | "transparent"
    | "warning"
  value?: string
}

const Button: FC<Props> = props => {
  const { isDisabled, isLoading, onClick } = props
  const handleOnClick = (e: React.MouseEvent) => {
    if (!isLoading || isDisabled) onClick?.(e)
  }

  return <StyledButton {...props} onClick={handleOnClick} />
}

export default Button
