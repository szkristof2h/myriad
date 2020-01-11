import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canceler } from 'axios';
import { ErrorContext } from '../contexts/ErrorContext.jsx';
import { UserContext } from '../contexts/UserContext.jsx';
import Comment from './Comment.jsx';
import {
  Button,
  ButtonError,
  ButtonTransparent
} from "../components/Button.style";
import { Base } from "../Typography/Typography.style";
import { TextArea } from "../components/Input.style";
import StyledComments from "./Comments.style";
import { get, post } from '../utils/api.js';

export interface CommentsDataInterface {
  getData: Promise<{
    ids: string[]
    comments: CommentData[]
    errors?: {}
  }>
  cancel: Canceler
  getHasFailed: () => boolean
}

interface CommentData {
  id: string
  text: string
  postedByName: string
}

interface Props {
  idPost: string
  commentCount?: number
  setCommentCount?: (count: number) => number | void
  type: "post" | "messages"
}

const Comments: FC<Props> = ({ commentCount, setCommentCount, idPost, type }) => {
  const [comments, setComments] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [idComments, setIdComments] = useState<string[]>([])
  const [newComment, setNewComment] = useState('')
  const { setErrors } = useContext(ErrorContext)
  const { user } = useContext(UserContext)

  const getComments = () => {
    setIsLoading(true)
    const { getData, cancel, getHasFailed }: CommentsDataInterface = get(
      `${type === 'post' ? 'comments' : 'message'}/${idPost}/${
        idComments.length
      }/20`,
      () => setErrors(errors => [...errors, 'some error message here'])
    )

    const setAllComments = async () => {
      const { errors, ids, comments: newComments } = await getData

      if (errors) setErrors(errors => [...errors, errors])
      else if (!getHasFailed) {
        setComments({ ...comments, ...newComments })
        setIdComments([...idComments, ...ids])
      }
    }

    setIsLoading(false)
    return { cancel, setAllComments }
  }

  const handleLoadMore = e => {
    e.preventDefault()
    getComments()
  }

  const handleSubmit = async e => {
    e.preventDefault()

    setIsLoading(true)
    const { getData, getHasFailed }: CommentsDataInterface = post(
      `${type === 'post' ? 'comment' : 'message'}`,
      {
        [type === 'post' ? 'postedOn' : 'postedByName']: idPost,
        text: newComment,
      },
      () => setErrors(errors => [...errors, 'some error message here'])
    )

    const addComment = async () => {
      const { errors, ids, comments: newComments } = await getData

      if (errors) setErrors(errors => [...errors, errors])
      else if (!getHasFailed) {
        setComments(comments => ({ ...comments, newComments }))
        setIdComments([...idComments, ...ids])
        setNewComment('')
        setCommentCount && commentCount && setCommentCount(commentCount + 1)
      }
    }

    await addComment()
    setIsLoading(false) // TODO: should use unique loading state, otherwise might get not real loading state
  }

  useEffect(() => {
    const { cancel, setAllComments } = getComments()
    ;(async () => await setAllComments())()

    return cancel
  }, [idPost])

  return (
    <StyledComments className={`comments comments--${type}`}>
      {!idComments || idComments.length == 0 ? (
        <Base className="warning">There are no comments yet!</Base>
      ) : (
        idComments.map(c =>
          comments[c] ? (
            <Comment
              key={c}
              userName={
                type === 'messages'
                  ? comments[c]['postedByName'].filter(u =>
                      comments[c].poster !== user._id
                        ? u !== user.displayName
                        : u === user.displayName
                    )[0]
                  : comments[c].postedByName[0]
              }
              {...comments[c]}
            />
          ) : null
        )
      )}
      {commentCount && commentCount !== 0 && idComments.length < commentCount && (
        <ButtonTransparent as={Link} onClick={e => handleLoadMore(e)} to="">
          Load more...
        </ButtonTransparent>
      )}
      {user.logged && (
        <TextArea
          onChange={e => setNewComment(e.currentTarget.value)}
          placeholder="Write a comment!"
          rows="1"
          value={newComment}
        />
      )}
      {user.logged && (
        <Button as={Link} onClick={handleSubmit} to="">
          {type === 'messages' ? 'Send Message' : 'Send'}
        </Button>
      )}
      {!user.logged && (
        <ButtonError as={Link} to="/login">
          You have to be logged in to post a comment
        </ButtonError>
      )}
    </StyledComments>
  )
}

export default Comments
