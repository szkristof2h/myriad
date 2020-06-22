import React, { lazy, Suspense, useContext, useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { NavigationContext } from "../contexts/NavigationContext"
import { PostsContext } from "../contexts/PostsContext"
import { Header, Error } from "../Typography/Typography.style"
import { Button } from "../components"
import StyledNotifications from "./Notifications.style"

const Post = lazy(() => import("../Post/Post" /* webpackChunkName: "Post" */))

const Notifications = () => {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)
  const { refresh } = useContext(NavigationContext)
  const { getPosts, notifications, setFocused } = useContext(PostsContext)

  const openPost = (id: string) => {
    setFocused(id)
    history.push(`/post/${id}`)
  }

  // Left the ability to refresh posts (updates)
  useEffect(() => {
    !isLoading && loadPosts()
  }, [refresh])

  const loadPosts = () => {
    setIsLoading(true)

    const { cancel, setPostsContext } = getPosts(
      `notifications/${notifications.length ?? 0}/0`
    )

    ;(async () => await setPostsContext())()

    setIsLoading(false)
    return cancel
  }

  useEffect(() => {
    const cancel = loadPosts()
    return cancel
  }, [])

  const loadMore = (e: React.MouseEvent) => {
    e.preventDefault()
    loadPosts()
  }

  return (
    <StyledNotifications>
      <Header centered size={2} className="header">
        Updates
      </Header>
      <Suspense fallback={<div className="">Loading updates...</div>}>
        {notifications.map(
          post =>
            post.id.length > 20 && (
              <Post
                key={post.id}
                openPost={() => openPost(post.id)}
                type="notification"
                size={5}
                {...post}
              />
            )
        )}
      </Suspense>
      {notifications.length != 0 ? (
        <Button
          type="primary"
          as={Link}
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
