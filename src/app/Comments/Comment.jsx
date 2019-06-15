import React from 'react';
import Proptypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Base } from "../Typography/Typography.style";
import { TextArea } from "../components/Input.style";
import StyledComment from "./Comment.style";

export default function Comment({ date, text, userName }) {
  return (
    <StyledComment>
      <Link className="user" to={`/user/${userName}`}>
        {userName}
      </Link>
      <Base className="text">
        {': '+ text}
      </Base>
      <span className="date">
        {' on \'' + date.slice(2, 10)}
      </span>
    </StyledComment>
  );
}

Comment.propTypes = {
  date: Proptypes.string.isRequired,
  text: Proptypes.string.isRequired,
  userName: Proptypes.string.isRequired
}
