import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Proptypes from 'prop-types';
import axios from 'axios';
import Star from 'react-feather/dist/icons/star';
import { Facebook, Twitter } from 'react-feather';
import { ErrorContext } from '../contexts/ErrorContext.jsx';
import { PostsContext } from '../contexts/PostsContext.jsx';
import config from '../config';
import Meh from '../images/Meh.jsx';
import Popup from '../Popup.jsx';
import RateButton from '../RateButton.jsx';
import './post.css';
import sample from '../images/add.svg';

const Comments = lazy(() => import('../Comments/Comments.jsx' /* webpackChunkName: "Comments" */));

const siteUrl = config.url;

export default function Post({
  _id,
  col,
  comments,
  description,
  dismiss,
  downs,
  image,
  link,
  openPost,
  postedByName,
  rated,
  row,
  size,
  title,
  type,
  ups
}) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState();
  const { setErrors } = useContext(ErrorContext);
  const { getPost, setPosts } = useContext(PostsContext);
  const url = `${siteUrl}/${_id}`;

  const rate = (val, e) => {
    e.preventDefault();
    setLoading(true);

    !loading &&
      axios
        .post(`${siteUrl}/post/post/rating`, { _id, rating: val })
        .then(res => {
          setLoading(false);
          if (res.data.errors) setErrors(errors => [...errors, res.data]);
          else {
            if (rated && rated === val)
              return setPosts(posts => ({
                ...posts,
                [_id]: {
                  ...posts[_id],
                  rated: 0,
                  [val > 0 ? "ups" : "downs"]: val > 0 ? ups - 1 : downs - 1
                }
              }));

            setPosts(posts => ({
              ...posts,
              [_id]: {
                ...posts[_id],
                rated: val,
                [val > 0 ? "ups" : "downs"]: val > 0 ? ups + 1 : downs + 1
              }
            }));
            if (rated)
              setPosts(posts => ({
                ...posts,
                [_id]: {
                  ...posts[_id],
                  [val < 0 ? "ups" : "downs"]: val < 0 ? ups - 1 : downs - 1
                }
              }));
          }
        })
        .catch(e => setErrors(errors => [...errors, e.response.data]));
  };

  const handleClick = e => e.target === e.currentTarget && openPost();

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    if (!title && mounted) {
      setLoading(true);
      getPost(_id).then(() => mounted && setLoading(false));
    }
  }, [mounted, _id]);

  const classType = `post post--${
    type && type !== "notification"
      ? "stand-alone"
      : size < 6
      ? "sub2"
      : size < 18
      ? "sub1"
      : "main"
  }`;

  const postTemplate = (
    <div
      className={classType}
      onClick={e => handleClick(e)}
      style={{
        background: `gray url('${
          _id.length != 20 ? image[0] : sample
        }') no-repeat center`,
        backgroundSize:
          _id.length == 20 ? `70px 70px` : !type ? "cover" : "auto auto",
        gridColumn: `${!type ? "" + col + " / span " + size : "initial"}`,
        gridRow: `${!type ? "" + row + " / span " + size : "initial"}`
      }}
    >
      <div className="post__details">
        <div className="post__personal">
          <h2 className={"post__title ellipsis"} onClick={e => handleClick(e)}>
            {title}
          </h2>
          <h2 className={"post__user ellipsis"}>@ {postedByName}</h2>
        </div>
        {title !== "Submit a post!" && (
          <RateButton
            className={`post__button post__button${rated > 0 ? "--rated" : ""}`}
            icon={
              <Star
                strokeWidth="1.5px"
                color="white"
                fill={rated > 0 ? "white" : "none"}
              />
            }
            handleClick={e => rate(1, e)}
            prefix={"post"}
            text={ups}
            to={"impressed"}
          />
        )}
        {title !== "Submit a post!" && (
          <RateButton
            className={`post__button post__button--meh post__button${
              rated < 0 ? "--rated" : ""
            }`}
            icon={<Meh strokeWidth="1.5px" color="white" />}
            handleClick={e => rate(-1, e)}
            prefix={"post"}
            text={downs}
            to={"meh"}
          />
        )}
      </div>
    </div>
  );

  return !type || type === "notification" ? (
    postTemplate
  ) : (
    <Popup show={true} dismiss={dismiss} dismissible={true} modifier="post">
      <div className="post--stand-alone">
        <div className="post__image-container">
          <img className="post__image" src={image[0]} />
        </div>
        <a className={"post__title ellipsis"} href={link} target="_blank">
          {title}
        </a>
        <Link className={"post__user ellipsis"} to={`/user/${postedByName}`}>
          @{postedByName}
        </Link>
        <div className="post__summary">{description}</div>
        <div className="post__buttons">
          <RateButton
            className={`post__button post__button--main post__button${
              rated > 0 ? "--rated" : ""
            }`}
            icon={
              <Star
                alt="Impressed!"
                className="post__icon post__impressed"
                fill={rated > 0 ? "yellow" : "none"}
                placeholder="Impressed!"
                size="40"
                strokeWidth="1.5px"
                color={rated > 0 ? "yellow" : "gray"}
              />
            }
            handleClick={e => rate(1, e)}
            prefix={"post"}
            text={ups}
            to={"impressed"}
          />
          <RateButton
            className={`post__button post__button--main post__button--meh post__button${
              rated < 0 ? "--rated" : ""
            }`}
            icon={
              <Meh
                alt="Meh..."
                className="post__icon post__meh"
                color={rated < 0 ? "black" : "gray"}
                placeholder="Meh..."
                size="40"
                strokeWidth="1.5px"
              />
            }
            handleClick={e => rate(-1, e)}
            prefix={"post"}
            text={downs}
            to={"meh"}
          />
          <div className="palceholder" />
          <a
            className="post__button post__button--main"
            href={`http://www.facebook.com/sharer.php?u=${url}[title]=${title}`}
          >
            <Facebook
              alt="share on facebook"
              className="post__share-icon post__share-icon--facebook"
              strokeWidth="1.5px"
              color="#3b5998"
              size="40"
            />
          </a>
          <a
            className="post__button post__button--main"
            href={`https://twitter.com/share?url=${url}`}
          >
            <Twitter
              alt="share on twitter"
              className="post__share-icon post__share-icon--twitter"
              strokeWidth="1.5px"
              color="#0084b4"
              size="40"
            />
          </a>
        </div>
        <Suspense fallback={<div>Loading comments...</div>}>
          <Comments
            closePost={dismiss}
            count={comments}
            id={_id}
            type={"post"}
          />
        </Suspense>
      </div>
    </Popup>
  );
}

Post.propTypes = {
  _id: Proptypes.string.isRequired,
  col: Proptypes.number,
  comments: Proptypes.number,
  description: Proptypes.string,
  dismiss: Proptypes.func,
  downs: Proptypes.number,
  image: Proptypes.array,
  link: Proptypes.string,
  openPost: Proptypes.func,
  postedByName: Proptypes.string,
  rated: Proptypes.number,
  row: Proptypes.number,
  size: Proptypes.number,
  title: Proptypes.string,
  type: Proptypes.string,
  ups: Proptypes.number
}
