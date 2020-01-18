import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorContext } from '../contexts/ErrorContext';
import { UserContext } from '../contexts/UserContext';
import Comment from './Comment';
import {
  Button,
  ButtonError,
  ButtonTransparent
} from "../components/Button.style";
import { Base } from "../Typography/Typography.style";
import { TextArea } from "../components/Input.style";
import StyledComments from "./Comments.style";
import { get, post, APIRequestInteface } from '../utils/api';

interface GetCommentsInterface extends APIRequestInteface<GetCommentsData> {}
export interface GetCommentsData {
  ids: string[]
  comments: CommentData[]
  error?: {}
}

export interface CommentData {
  id: string
  date: string
  text: string
  postedByName: string[]
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
  const { addError } = useContext(ErrorContext)
  const { user } = useContext(UserContext)

  const getComments = () => {
    setIsLoading(true)
    const { getData, cancel, getHasFailed }: GetCommentsInterface = get<GetCommentsData>(
      `${type === 'post' ? 'comments' : 'message'}/${idPost}/${
        idComments.length
      }/20`,
      () => addError({ comments: ['some error message here']})
    )

    const setAllComments = async () => {
      const response = await getData()
      
      if (getHasFailed() || !response)
        return addError({ comments: [`get comments request failed`]})

      const { data: { error, ids, comments: newComments } } = response

      if (error) return addError(error)
      
      setComments({ ...comments, ...newComments })
      setIdComments([...idComments, ...ids])
    }

    setIsLoading(false)
    return { cancel, setAllComments }
  }

  const handleLoadMore = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isLoading) {
      const { setAllComments } = getComments()
      await setAllComments()
    }
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (isLoading) return false
    setIsLoading(true)
    const { getData, cancel, getHasFailed }: GetCommentsInterface = post<
      GetCommentsData
    >(
      `${type === "post" ? "comment" : "message"}`,
      {
        [type === "post" ? "postedOn" : "postedByName"]: idPost,
        text: newComment,
      },
      () => addError({ comments: ["some error message here"]})
    )

    // TODO: probably there's reason to make this its own function
    const addComment = async () => {
      const response = await getData()
      if (getHasFailed() || !response)
        return addError({ comments: [`post comment request failed`]})

      const {
        data: { error, ids, comments: newComments },
      } = response

      if (error) return addError(error)

      setComments(comments => ({ ...comments, newComments }))
      setIdComments([...idComments, ...ids])
      setNewComment('')
      setCommentCount && commentCount && setCommentCount(commentCount + 1)
    }

    await addComment()
    setIsLoading(false) // TODO: should use unique loading state, otherwise might get not real loading state
  }

  useEffect(() => {
    if (!isLoading) {
      const { cancel, setAllComments } = getComments()
      ;(async () => await setAllComments())()

      return cancel
    }
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
                      comments[c].poster !== user.id
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
