import React, { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './rate-button.css';

interface Props {
  className: string,
  icon: ReactNode,
  handleClick: Function,
  prefix: string,
  text?: number,
  to: string
}

const RateButton: FC<Props> = ({ className, icon, handleClick, prefix, text, to }) => {
  return (
    <Link className={className} to={`/${to}`} onClick={handleClick}>
      {icon}
      <div className={`${prefix}__text`}>
        {text}
      </div>
    </Link>
  )
}

export default RateButton
