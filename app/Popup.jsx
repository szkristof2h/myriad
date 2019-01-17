import React from 'react';
import Proptypes from 'prop-types';
import './popup.css';

export default function Popup ({ children, dismiss, dismissible, modifier, show }) {
  const handleClick = e => dismissible ? e.target === e.currentTarget && dismiss(false) : {};
  
  return show ? (
    <div className={`popup ${modifier ? 'popup--' + modifier : ''}`} onClick={e => handleClick(e)}>
        {children}
      </div>
    ) : null;
}

Popup.propTypes = {
  children: Proptypes.object.isRequired,
  dismiss: Proptypes.func,
  dismissible: Proptypes.bool,
  modifier: Proptypes.string,
  show: Proptypes.bool.isRequired
}
