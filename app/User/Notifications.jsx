import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Proptypes from 'prop-types';
import axios from 'axios';
import { ErrorContext } from '../contexts/ErrorContext.jsx';
import { NavigationContext } from '../contexts/NavigationContext.jsx';
import config from '../config';
import './notifications.css';

const siteUrl = config.url;

const Post = lazy(() => import('../Post/Post.jsx' /* webpackChunkName: "Post" */));

export default function Notifications({ history }) {
  const [posts, setPosts] = useState({});
  const { refresh } = useContext(NavigationContext);
  const { setErrors } = useContext(ErrorContext);

  const openPost = id => history.push(`/post/${id}`);

  // Left the ability to refresh posts (updates)
  useEffect(() => {
    loadPosts();
  }, [refresh]);

  const loadPosts = () => {
    axios
      .get(`${siteUrl}/get/notifications/${posts.ids ? posts.ids.length : 0}/0`)
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else {
          setPosts(posts => (posts.ids ? { ...posts, ...res.data, ids: [...posts.ids, ...res.data.ids] }
            : { ...res.data, ids: res.data.ids }));
        }
      })
      .catch(e => setErrors(errors => [...errors, e.response.data]));
  }

  const loadMore = e => e.preventDefault() && loadPosts();

  return (
    <div className={`notifications box box--basic`}>
      <div className="posts__header">Updates</div>
      <Suspense fallback={<div className="">Loading updates...</div>}>
        {posts.ids && posts.ids.map((id, i) =>
          <Post
            key={id}
            openPost={() => openPost(i, id)}
            type="notification"
            size={5}
            {...posts[id]} />
        )}
      </Suspense>
      {posts.ids && posts.ids.length != 0 ? <Link to="/notifications/load" className="notifications__button button" onClick={e => loadMore(e)}>
        Load more...
      </Link> : <div className="notifications__info">No updates!</div>
      }
    </div>
  )
}

Notifications.propTypes = {
  history: Proptypes.object.isRequired
}
