import React, { FC, useContext, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import Comment from "./Comment"
import { Button } from "../components"
import { Base } from "../Typography/Typography.style"
import { TextArea } from "../components"
import StyledComments from "./Comments.style"
import { CommentType } from "src/server/db/models/Comment"
import useGetData from "../hooks/useGetData"
import Loader from "../Loader"
import usePostData from "../hooks/usePostData"

export interface GetCommentsData {
  comments: CommentData[]
}

export interface PostCommentData {
  status: "success" | "failed"
}

export interface PostCommentVariables {
  idParent: string
  text: string
}

export interface CommentData extends CommentType {
  displayName: string
  id: string
}

interface Props {
  idParent: string
  commentCount?: number
  type: "post" | "messages"
}

const Comments: FC<Props> = ({ commentCount, idParent, type }) => {
  const [newComment, setNewComment] = useState("")
  const [url, setUrl] = useState(
    `${type === "post" ? "comments" : "message"}/${idParent}/0/20`
  )
  const { currentUser } = useContext(UserContext)
  const { data, isLoading, refetch } = useGetData<GetCommentsData>(url)
  const {
    startPost: startPostRequest,
    isLoading: isLoadingSubmit,
  } = usePostData<PostCommentData, PostCommentVariables>(
    `${type === "post" ? "comment" : "message"}`
  )
  const comments = data?.comments

  const handleLoadMore = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!isLoading)
      setUrl(
        `${type === "post" ? "comments" : "message"}/${idParent}/${
          comments?.length
        }/20`
      )
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!isLoading && !isLoadingSubmit) {
      await startPostRequest({
        idParent,
        text: newComment,
      })
      setNewComment("")
      refetch()
    }
  }

  return (
    <StyledComments>
      {comments?.length == 0 ? (
        <Base>There are no comments yet!</Base>
      ) : isLoading ? (
        <Loader />
      ) : (
        comments?.map(comment => (
          <Comment
            key={comment.id}
            userName={comment.displayName}
            {...comment}
          />
        ))
      )}
      {!!commentCount && comments && comments.length < commentCount && (
        <Button
          type="transparent"
          onClick={handleLoadMore}
          to=""
          isLoading={isLoading}
        >
          Load more...
        </Button>
      )}
      {currentUser?.id && (
        <TextArea
          onChange={e => setNewComment(e.currentTarget.value)}
          placeholder="Write a comment!"
          rows="1"
          value={newComment}
        />
      )}
      {currentUser?.id && (
        <Button
          type="primary"
          onClick={handleSubmit}
          to=""
          isLoading={isLoadingSubmit || isLoading}
        >
          {type === "messages" ? "Send Message" : "Send"}
        </Button>
      )}
      {!currentUser?.id && (
        <Button type="danger" to="/login">
          You have to be logged in to post a comment
        </Button>
      )}
    </StyledComments>
  )
}

export default Comments
