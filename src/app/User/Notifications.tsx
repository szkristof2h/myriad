import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavigationContext } from '../contexts/NavigationContext.jsx';
import { PostsContext, Post } from '../contexts/PostsContext';
import { Header, Error } from "../Typography/Typography.style";
import { Button } from "../components/Button.style";
import StyledNotifications from "./Notifications.style";

const Post = lazy(() => import('../Post/Post' /* webpackChunkName: "Post" */));

const Notifications = ({ history }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { refresh } = useContext(NavigationContext); 
  const {
    getPosts,
    ids,
    posts,
    setFocused,
  } = useContext(PostsContext)

  const openPost = id => {
    setFocused(id);
    history.push(`/post/${id}`);
  };

  // Left the ability to refresh posts (updates)
  useEffect(() => {
    !isLoading && loadPosts();
  }, [refresh]);

  const loadPosts = () => {
    setIsLoading(true)

    const { cancel, setPostsContext } = getPosts(
      `notifications/${ids.length ?? 0}/0`
    )

    ;(async () => await setPostsContext())()
    setIsLoading(false)
    return cancel
  }

  useEffect(() => {
    const cancel = loadPosts()
    return cancel
  }, []);

  const loadMore = e => e.preventDefault() && loadPosts();// cancel?

  return (
    <StyledNotifications>
      <Header centered size={2} className="header">
        Updates
      </Header>
      <Suspense fallback={<div className="">Loading updates...</div>}>
        {ids &&
          ids.map(id => (
            <Post
              key={id}
              openPost={() => openPost(id)}
              type="notification"
              size={5}
              {...posts[id]}
            />
          ))}
      </Suspense>
      {ids && ids.length != 0 ? (
        <Button as={Link} to="/notifications/load" onClick={e => loadMore(e)}>
          Load more...
        </Button>
      ) : (
        <Error centered size={1}>
          No updates!
        </Error>
      )}
    </StyledNotifications>
  );
}

export default Notifications
