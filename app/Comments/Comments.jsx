import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Proptypes from 'prop-types';
import axios from 'axios';
import { ErrorContext } from '../contexts/ErrorContext.jsx';
import { NavigationContext } from '../contexts/NavigationContext.jsx';
import { UserContext } from '../contexts/UserContext.jsx';
import config from '../config';
import Comment from './Comment.jsx';
import './comments.css';

const siteUrl = config.url;
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

export default function Comments({ closePost, count, id, type }) {
  const [comments, setComments] = useState({});
  const [commentCount, setCommentCount] = useState(count);
  const [ids, setIds] = useState([]);
  const [mounted, setMounted] = useState(true);
  const [newComment, setNewComment] = useState('');
  const { setErrors } = useContext(ErrorContext);
  const { setShowLogin } = useContext(NavigationContext);
  const { user } = useContext(UserContext);

  const getComments = () => {
    axios
      .get(`${siteUrl}/get/${type === 'post' ? 'comments' : 'message'}/${id}/${ids.length}/20`, 
        { cancelToken: source. token })
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else if (mounted) {
          setComments(c => ({ ...c, ...res.data.comments }));
          setIds(cIds => [...cIds, ...res.data.ids]);
        }
      })
      .catch(e => !axios.isCancel(e) && setErrors(errors => [...errors, e.response.data]));
  };

  const handleLoadMore = e => {
    if (user.logged) return;
    e.preventDefault();
    getComments();
  };

  const handleShowLogin = e => {
    if (user.logged) return;
    e.preventDefault();
    setShowLogin(true);
    closePost();
  };

  const handleSubmit = e => {
    e.preventDefault();

    axios
      .post(`${siteUrl}/post/${type === 'post' ? 'comment' : 'message'}`, { [type === 'post' ? 'postedOn' : 'postedByName']: id, text: newComment })
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else if (mounted) {
          setComments(comments => ({ ...comments, [res.data.ids]: res.data.comments[res.data.ids] }))
          setIds(ids => [...ids, res.data.ids]);
          setNewComment('');
          type === 'post' && setCommentCount(commentCount => commentCount + 1);
        }
      })
      .catch(e => setErrors(errors => [...errors, e.response.data]));
  };

  useEffect(() => {getComments()}, [id]);
  useEffect(() => {setCommentCount(count)}, [count]);
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      source.cancel();// cancel axios request
    }
  }, []);

  return (
    <div className={`comments comments--${type}`}>
      {!ids || ids.length == 0 ? <div className="comments__warning">There are no comments yet!</div>
        : ids.map(c =>
          comments[c] ? <Comment key={c}
            userName={type === 'messages' ? comments[c]['postedByName'].filter(u =>
              comments[c].poster !== user._id ? u !== user.displayName : u === user.displayName)[0] :
              comments[c].postedByName[0]} {...comments[c]} /> : null)}
      {(!commentCount || ids.length < commentCount) &&
        <Link className="comments__button button button--transparent" onClick={e => handleLoadMore(e)} to="" >
          Load more...
        </Link>}
      {user.logged && <textarea className="comments__input"
        onChange={e => setNewComment(e.currentTarget.value)}
        placeholder="Write a comment!"
        rows="1"
        value={newComment} />}
      {user.logged && <Link className="comments__submit button" onClick={handleSubmit} to="">
        {type === 'messages' ? 'Send Message' : 'Send'}
      </Link>}
      {!user.logged && <Link className="comments__warning" onClick={e => handleShowLogin(e)} to="/login">
        You have to be logged in to post a comment
      </Link>}
    </div>
  );
}

Comments.propTypes = {
  count: Proptypes.number,
  closePost: Proptypes.func,
  id: Proptypes.string.isRequired,
  type: Proptypes.string.isRequired
}
