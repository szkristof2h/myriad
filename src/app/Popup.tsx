import React, { FC } from "react"
import StyledPopup from "./Popup.style"

export interface Props {
  dismiss?: (shouldDismiss: boolean) => void
  dismissible?: boolean
  type?: "basic" | "scrollY" | "post" | "profile" | "submit"
  show: boolean
}

const Popup: FC<Props> = ({
  children,
  dismiss,
  dismissible,
  show,
  type = "basic",
}) => {
  const handleClick = (e: React.MouseEvent) =>
    dismissible ? e.target === e.currentTarget && dismiss && dismiss(false) : {}

  return show ? (
    <StyledPopup type={type} onClick={(e) => handleClick(e)}>
      {children}
    </StyledPopup>
  ) : null
}

export default Popup
