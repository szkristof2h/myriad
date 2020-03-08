import React, { FC, ReactNode, CSSProperties } from "react"
import StyledButton from "./styles"

export interface Props {
  onClick?: (e: React.MouseEvent) => void
  value?: string
  className?: string
  placeholder?: string
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
  active?: boolean
  rated?: boolean // used only for rating buttons, might be unnecessary
  to?: string
  as?: ReactNode
  href?: string
  style?: CSSProperties
}

const Button:FC<Props> = props => {

  return <StyledButton {...props} />
}

export default Button
