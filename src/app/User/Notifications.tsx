import React, { useContext, useState } from "react"
import { useHistory } from "react-router-dom"
import { PostsContext, GetPostsData } from "../contexts/PostsContext"
import { Header, Error } from "../Typography/Typography.style"
import { Button } from "../components"
import StyledNotifications from "./Notifications.style"
import useGetData from "../hooks/useGetData"
import GridPost from "../Post/GridPost"

const Notifications = () => {
  const history = useHistory()
  const { setFocused } = useContext(PostsContext)
  const [url, setUrl] = useState(`notifications/0/0`)
  const { data: postsData, isLoading } = useGetData<GetPostsData>(url)
  const posts = postsData?.posts

  const openPost = (id: string) => {
    setFocused(id)
    history.push(`/post/${id}`)
  }

  const loadMore = (e: React.MouseEvent) => {
    e.preventDefault()
    setUrl(`notifications/${posts?.length ?? 0}/0`)
  }

  return (
    <StyledNotifications>
      <Header centered size={2} className="header">
        Updates
      </Header>
      {posts?.map(post => (
        <GridPost
          key={post.id}
          isLoading={isLoading}
          openPost={() => openPost(post.id)}
          type="notification"
          size={5}
          {...post}
        />
      ))}
      {posts?.length != 0 ? (
        <Button
          type="primary"
          to="/notifications/load"
          onClick={e => loadMore(e)}
        >
          Load more...
        </Button>
      ) : (
        <Error centered size={1}>
          No updates!
        </Error>
      )}
    </StyledNotifications>
  )
}

export default Notifications
