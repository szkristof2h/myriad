import React from 'react';
import { Link } from 'react-router-dom';
import Proptypes from 'prop-types';
import './rate-button.css';

export default function RateButton({ className, icon, handleClick, prefix, text, to }) {
  return (
    <Link className={className} to={`/${to}`} onClick={handleClick}>
      {icon}
      <div className={`${prefix}__text`}>
        {text}
      </div>
    </Link>
  )
}

RateButton.propTypes = {
  className: Proptypes.string.isRequired,
  icon: Proptypes.object.isRequired,
  handleClick: Proptypes.func.isRequired,
  prefix: Proptypes.string.isRequired,
  text: Proptypes.number,
  to: Proptypes.string.isRequired
}
