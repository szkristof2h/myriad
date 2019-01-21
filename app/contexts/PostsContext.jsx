import React, { createContext, useContext, useState } from 'react';
import Proptypes from 'prop-types';
import axios from 'axios';
import config from '../config';
import { ErrorContext } from './ErrorContext.jsx';


const siteUrl = config.url;
const PostsContext = createContext({
  previousUrl: '',
  ids: [],
  posts: {},
  positions: [],
  getPost: () => {},
  getPosts: () => {},
  setIds: () => {},
  setPositions: () => {},
  setPosts: () => {},
  setPreviousUrl: () => {}
});

const samplePost = {
  description: '',
  image: 'sample',
  rated: 0,
  title: 'Submit a post!'
};

const PostsProvider = ({ children }) => {
  const [focused, setFocused] = useState();
  const [previousUrl, setPreviousUrl] = useState('');
  const [posts, setPosts] = useState({});
  const [ids, setIds] = useState([]);
  const { setErrors } = useContext(ErrorContext);

  const getPosts = (u, t) => {
    return axios
      .get(`${siteUrl}/get/${u}`)
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else {
          const loaded = {};
          res.data.ids.forEach(id => loaded[id] = id.length == 20 ? { _id: id, postedByName: t, ...samplePost }
            : res.data[id]);
          setPosts(() => {
            setIds(res.data.ids);
            return loaded;
          });
        }
      })
      .catch(e => setErrors(errors => [...errors, e.response.data]));
  }

  const getPost = id => {
    return axios
      .get(`${siteUrl}/get/post/${id}`)
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else {
          setPosts(posts => ({
            ...posts, [id]: { ...res.data }
          }));
          setFocused(id);
        }
      });
  }

  return (
    <PostsContext.Provider value={{
      focused,
      getPost,
      getPosts,
      ids,
      posts,
      previousUrl,
      setFocused,
      setIds,
      setPosts,
      setPreviousUrl
    }}>
      {children}
    </PostsContext.Provider>
  )
}

PostsProvider.propTypes = {
  children: Proptypes.array
}

export { PostsProvider, PostsContext };
