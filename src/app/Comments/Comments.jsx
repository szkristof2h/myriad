import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Proptypes from 'prop-types';
import axios from 'axios';
import { ErrorContext } from '../contexts/ErrorContext.jsx';
import { NavigationContext } from '../contexts/NavigationContext.jsx';
import { UserContext } from '../contexts/UserContext.jsx';
import config from '../config';
import Comment from './Comment.jsx';
import {
  Button,
  ButtonError,
  ButtonTransparent
} from "../components/Button.style";
import { Base } from "../Typography/Typography.style";
import { TextArea } from "../components/Input.style";
import StyledComments from "./Comments.style";

const siteUrl = config.url;

export default function Comments({ closePost, count, id, type }) {
  const [comments, setComments] = useState({});
  const [commentCount, setCommentCount] = useState(count);
  const [ids, setIds] = useState([]);
  const [mounted, setMounted] = useState(true);
  const [newComment, setNewComment] = useState('');
  const { setErrors } = useContext(ErrorContext);
  const { user } = useContext(UserContext);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

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
    e.preventDefault();
    getComments();
  };

  const handleSubmit = e => {
    e.preventDefault();

    axios
      .post(`${siteUrl}/post/${type === "post" ? "comment" : "message"}`, {
        [type === "post" ? "postedOn" : "postedByName"]: id,
        text: newComment
      })
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else if (mounted) {
          setComments(comments => ({
            ...comments,
            [res.data.ids]: res.data.comments[res.data.ids]
          }));
          setIds(ids => [...ids, res.data.ids]);
          setNewComment("");
          type === "post" &&
            setCommentCount(commentCount => commentCount + 1);
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
    <StyledComments className={`comments comments--${type}`}>
      {!ids || ids.length == 0 ? (
        <Base className="warning">There are no comments yet!</Base>
      ) : (
        ids.map(c =>
          comments[c] ? (
            <Comment
              key={c}
              userName={
                type === "messages"
                  ? comments[c]["postedByName"].filter(u =>
                      comments[c].poster !== user._id
                        ? u !== user.displayName
                        : u === user.displayName
                    )[0]
                  : comments[c].postedByName[0]
              }
              {...comments[c]}
            />
          ) : null
        )
      )}
      {(commentCount !== 0 && ids.length < commentCount) && (
        <ButtonTransparent
          as={Link}
          onClick={e => handleLoadMore(e)}
          to=""
        >
          Load more...
        </ButtonTransparent>
      )}
      {user.logged && (
        <TextArea
          onChange={e => setNewComment(e.currentTarget.value)}
          placeholder="Write a comment!"
          rows="1"
          value={newComment}
        />
      )}
      {user.logged && (
        <Button
          as={Link}
          onClick={handleSubmit}
          to=""
        >
          {type === "messages" ? "Send Message" : "Send"}
        </Button>
      )}
      {!user.logged && (
        <ButtonError
          as={Link}
          to="/login"
        >
          You have to be logged in to post a comment
        </ButtonError>
      )}
    </StyledComments>
  );
}

Comments.propTypes = {
  count: Proptypes.number,
  closePost: Proptypes.func,
  id: Proptypes.string.isRequired,
  type: Proptypes.string.isRequired
}
