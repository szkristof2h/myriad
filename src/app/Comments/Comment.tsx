import React, { FC } from "react"
import { Link } from "react-router-dom"
import { Base } from "../Typography/Typography.style"
import StyledComment from "./Comment.style"

interface Props {
  createdAt: string
  text: string
  userName: string
}

const Comment: FC<Props> = ({ createdAt, text, userName }) => {
  return (
    <StyledComment>
      <Link className="user" to={`/user/${userName}`}>
        {userName}
      </Link>
      <Base className="text">{": " + text}</Base>
      <span className="date">{" on '" + createdAt.slice(2, 10)}</span>
    </StyledComment>
  )
}

export default Comment
