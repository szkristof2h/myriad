import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Proptypes from 'prop-types';
import axios from 'axios';
import { ErrorContext } from '../contexts/ErrorContext.jsx';
import { NavigationContext } from '../contexts/NavigationContext.jsx';
import { PostsContext } from '../contexts/PostsContext.jsx';
import config from '../config';
import { Header, Error } from "../Typography/Typography.style";
import { Button } from "../components/Button.style";
import StyledNotifications from "./Notifications.style";

const siteUrl = config.url;

const Post = lazy(() => import('../Post/Post.jsx' /* webpackChunkName: "Post" */));

export default function Notifications({ history }) {
  const [loading, setLoading] = useState(true);// to avoid double inital get request
  const [posts, setPosts] = useState({});
  const { setErrors } = useContext(ErrorContext);
  const { refresh } = useContext(NavigationContext);
  const { setFocused } = useContext(PostsContext);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const openPost = id => {
    setFocused(id);
    history.push(`/post/${id}`);
  };

  // Left the ability to refresh posts (updates)
  useEffect(() => {
    !loading && loadPosts();
  }, [refresh]);

  const loadPosts = () => {
    axios
      .get(`${siteUrl}/get/notifications/${posts.ids ? posts.ids.length : 0}/0`, { cancelToken: source.token })
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else {
          setPosts(posts => (posts.ids ? { ...posts, ...res.data, ids: [...posts.ids, ...res.data.ids] }
            : { ...res.data, ids: res.data.ids }));
          setLoading(false);
        }
      })
      .catch(e => !axios.isCancel(e) && setErrors(errors => [...errors, e.response.data]));
  }

  useEffect(() => {
    loadPosts();
    return () => {
      source.cancel();// cancel axios request
    }
  }, []);

  const loadMore = e => e.preventDefault() && loadPosts();

  return (
    <StyledNotifications>
      <Header centered size={2} className="header">
        Updates
      </Header>
      <Suspense fallback={<div className="">Loading updates...</div>}>
        {posts.ids &&
          posts.ids.map(id => (
            <Post
              key={id}
              openPost={() => openPost(id)}
              type="notification"
              size={5}
              {...posts[id]}
            />
          ))}
      </Suspense>
      {posts.ids && posts.ids.length != 0 ? (
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

Notifications.propTypes = {
  history: Proptypes.object.isRequired
}
