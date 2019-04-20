import React from 'react';
import Proptypes from 'prop-types';
import { Link } from 'react-router-dom';
import './comment.css';

export default function Comment({ date, text, userName }) {
  return (
    <div className="comment">
      <Link className="comment__user" to={`/user/${userName}`}>
        {userName}
      </Link>
      <span className="comment__text">
        {': '+ text}
      </span>
      <span className="comment__date">
        {' on \'' + date.slice(2, 10)}
      </span>
    </div>
  );
}

Comment.propTypes = {
  date: Proptypes.string.isRequired,
  text: Proptypes.string.isRequired,
  userName: Proptypes.string.isRequired
}
