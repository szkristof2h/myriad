import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import Proptypes from 'prop-types';
import { NavigationContext } from './contexts/NavigationContext.jsx';
import { PostsContext } from './contexts/PostsContext.jsx';
import { UserContext } from './contexts/UserContext.jsx';
import Loader from './Loader.jsx';
import Tags from './Tags.jsx';
import './posts.css';

const Post = lazy(() => import('./Post/Post.jsx' /* webpackChunkName: "Post" */));

const setPos = () => {
  const ratio = [18, 6, 5];
  let positions = [[0, 0, ratio[0]]];
  let offset = 0;

  const surround = (r, index, a = 1) => {
    const currentRatio = r[1];
    const parentRatio = r[0];
    const length = Math.floor(parentRatio * a / currentRatio) + 2;

    for (let i = 0; i < length; i++) {
      positions = [...positions, [(i - 1) * currentRatio - offset, -currentRatio - offset, currentRatio]];
      positions = [...positions, [(i - 1) * currentRatio - offset, (length - 2) * currentRatio - offset, currentRatio]];
      if (i != 0 && i != length - 1) positions = [...positions, [-currentRatio - offset, (i - 1) * currentRatio - offset, currentRatio]];
      if (i != 0 && i != length - 1) positions = [...positions, [(length - 2) * currentRatio - offset, (i - 1) * currentRatio - offset, currentRatio]];
    }

    index++;
    const newOffset = offset + currentRatio;
    if (r.length !== index - 2) offset = newOffset;
    r.length === index - 2 ? true : surround(r.slice(1), index, length);
  }

  surround(ratio, 0);

  return [positions, offset];
}

export default function Posts({ fullUrl, history, tag, url, userName }) {
  const [mounted, setMounted] = useState(true);
  const [offset, setOffset] = useState(0);
  const { refresh, setRefresh } = useContext(NavigationContext);
  const { focused, getPosts, ids, posts, previousUrl, setFocused, setPreviousUrl } = useContext(PostsContext);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState('');
  const { user } = useContext(UserContext);
  
  const openPost = (i, id) => {
    setFocused(id);
    history.push(id.length != 20 ? `/post/${id}` : user.logged ? user.displayName ? '/add' : '/profile' : '/login');
  }

  const closePost = () => {
    setFocused();
    history.push(previousUrl ? previousUrl : '/');
  }

  useEffect(() => {
    setMounted(true);
    // Initialized post positions
    const p = setPos();
    setOffset(p[1]);
    setPositions(p[0]);
    return () => {
      setFocused();
      setMounted(false);
      setRefresh(false);
    }
  }, []);

  useEffect(() => {
    const type = fullUrl && fullUrl.split("/").length == 3 && fullUrl.split("/")[1] === "post" ?
      "post" : tag ? tag : userName ? userName : "";
      `posts${userName ? '/user' : ''}${tag ? '/' + tag.trim() : userName ? '/' + userName : ''}`;
    
    // Checks if url was the previous one (and is not refreshing) to avoid loading unnecessarily
    if ((type !== "post" || !previousUrl) && (previousUrl !== url || refresh)) {
      setPositions([]);// reset position
      setLoading(true);
        getPosts(`posts${userName ? '/user' : ''}${tag ? '/' + tag.trim() : userName ? '/' + userName : ''}`, type)
          .then(() => {
            if (mounted) {
              const p = setPos();
              setOffset(p[1]);
              setPositions(p[0]);
              setLoading(false);
              setPreviousUrl(url)
              setRefresh(false);
            }
          });
    }
  }, [refresh, tag, userName]);

  return (
    <>
      <div className="main">
        <Suspense fallback={<Loader />}>
          {loading ? <Loader /> : ids.map((id, i) => positions.length > i && <Post
            key={id}
            col={positions[i][0] + offset}
            row={positions[i][1] + offset}
            openPost={() => openPost(i, id)}
            size={positions[i][2]}
            {...posts[id]} />
          )}
        </Suspense>
      </div>
      <Route exact path="/post/:postId" render={({ match }) =>
        <Suspense fallback={<Loader />}>
          <Post
            dismiss={closePost}
            _id={match.params.postId}
            type="standAlone"
            {...posts[focused]} />
        </Suspense>
      }
      />
      <Tags />
    </>
  )
}

Posts.propTypes = {
  fullUrl: Proptypes.string,
  history: Proptypes.object,
  tag: Proptypes.string,
  url: Proptypes.string,
  userName: Proptypes.string
}
