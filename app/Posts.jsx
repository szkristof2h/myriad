import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import Proptypes from 'prop-types';
import axios from 'axios';
import { ErrorContext } from './contexts/ErrorContext.jsx';
import { NavigationContext } from './contexts/NavigationContext.jsx';
import { UserContext } from './contexts/UserContext.jsx';
import Loader from './Loader.jsx';
import Tags from './Tags.jsx';
import config from './config';
import './posts.css';

const Post = lazy(() => import('./Post/Post.jsx' /* webpackChunkName: "Post" */));


const samplePost = {
  description: '',
  image: 'sample',
  rated: 0,
  title: 'Submit a post!'
}

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

const siteUrl = config.url;

export default function Posts({ history, tag, url, userName }) {
  const [focused, setFocused] = useState();
  const [location, setLocation] = useState();
  const [offset, setOffset] = useState(0);
  const [positions, setPositions] = useState([]);
  const [posts, setPosts] = useState({});
  const { refresh } = useContext(NavigationContext);
  const { setErrors } = useContext(ErrorContext);
  const { user } = useContext(UserContext);

  const openPost = (i, id) => {
    setFocused(id);
    setLocation(url);
    history.push(id.length != 20 ? `/post/${id}` : user.logged ? user.displayName ? '/add' : '/profile' : '/login');
  }

  const closePost = () => {
    setFocused();
    setLocation();
    history.push(focused ? location : '/');
  }

  useEffect(() => {
    const p = setPos();
    setOffset(p[1]);
    setPositions(p[0]);
  }, []);

  useEffect(() => {
    const type = tag ? tag : userName ? userName : "";

    axios
      .get(`${siteUrl}/get/posts${userName ? '/user' : ''}${tag ? '/' + tag.trim() : userName ? '/' + userName : ''}`)
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else {
          const loaded = {};
          res.data.ids.forEach(id => loaded[id] = id.length == 20 ? { _id: id, postedByName: type, ...samplePost }
            : res.data[id]);
          setPosts({ ...loaded, ids: res.data.ids });
        }
      })
      .catch(e => setErrors(errors => [...errors, e.response.data]));
  }, [refresh, tag, userName]);

  return (
    <>
      {<div className="main">
        <Suspense fallback={<Loader />}>
          {posts.ids && posts.ids.map((id, i) => <Post
            key={id}
            col={positions[i][0] + offset}
            row={positions[i][1] + offset}
            openPost={() => openPost(i, id)}
            size={positions[i][2]}
            {...posts[id]} />
          )}
        </Suspense>
      </div>}
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
  history: Proptypes.object,
  tag: Proptypes.string,
  url: Proptypes.string,
  userName: Proptypes.string
}
