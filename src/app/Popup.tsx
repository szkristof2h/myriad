import React, { FC } from 'react';
import StyledPopup from './Popup.style';

interface Props {
  dismiss?: (shouldDismiss: boolean) => void
  dismissible?: boolean
  modifier?: string
  type: "basic" | "scrollY" | "post" | "profile" |"submit"
  show: boolean
}

const Popup: FC<Props> = ({ children, dismiss, dismissible, modifier, show, type }) => {
  const handleClick = e => dismissible ? e.target === e.currentTarget && dismiss && dismiss(false) : {};
  
  return show ? (
    <StyledPopup
      type={type}
      className={`popup ${modifier ? 'popup--' + modifier : ''}`}
      onClick={e => handleClick(e)}
    >
      {children}
    </StyledPopup>
  ) : null
}

export default Popup