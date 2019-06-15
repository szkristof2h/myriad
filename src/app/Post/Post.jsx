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
import sample from '../images/add.svg';
import {
  ButtonArrow,
  ButtonRate,
  ButtonRateBig
} from "../components/Button.style";
import { Header, Base, UserHeader } from "../Typography/Typography.style";
import { StyledPost, StyledPostOpen } from "./Post.style";

const Comments = lazy(() => import('../Comments/Comments.jsx' /* webpackChunkName: "Comments" */));

const siteUrl = config.url;

export default function Post({
  _id,
  col,
  comments,
  description,
  dismiss,
  downs,
  images,
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
  const [imageIndex, setImageIndex] = useState(0);
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
        .catch(e => {
          setErrors(errors => [...errors, e.response.data]);
          setLoading(false);
        });
  };

  const handleClick = e => e.target === e.currentTarget && openPost();

  const handleImageStep = (e, step) => {
    e.preventDefault();
    setImageIndex(index => index + step);
  }

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

  const classType = `post ${
    type && type !== "notification"
      ? "stand-alone"
      : size < 6
      ? "sub2"
      : size < 18
      ? "sub1"
      : "main"
  }`;

  const styleSize = classType.includes("main") ? 2 : classType.includes("sub2") ? -1 : 1;

  const renderGridPost = () => (
    <StyledPost
      className={classType}
      onClick={e => handleClick(e)}
      style={{
        background: `gray url('${
          _id.length != 20 ? images[0] : sample
        }') no-repeat center`,
        backgroundSize:
          _id.length == 20 ? `70px 70px` : !type ? "cover" : "auto auto",
        gridColumn: `${!type ? "" + col + " / span " + size : "initial"}`,
        gridRow: `${!type ? "" + row + " / span " + size : "initial"}`
      }}
    >
      <div className="details">
        <div className="personal">
          <Header
            centered
            size={styleSize}
            className={"ellipsis"}
            onClick={e => handleClick(e)}
          >
            {title}
          </Header>
          {postedByName && (
            <UserHeader centered size={1} className={"user ellipsis"}>
              @ {postedByName}
            </UserHeader>
          )}
        </div>
        {title !== "Submit a post!" && type !== "notification" && (
          <ButtonRate
            className={`button`}
            as={Link}
            type={rated > 0 ? "rateActive" : "impressed"}
            onClick={e => rate(1, e)}
            to={"impressed"}
          >
            <Star
              className={"icon"}
              strokeWidth="1.5px"
              color="white"
              fill={rated > 0 ? "white" : "none"}
            />
            <Header size={styleSize}>{ups}</Header>
          </ButtonRate>
        )}
        {title !== "Submit a post!" && type !== "notification" && (
          <ButtonRate
            className={`button`}
            as={Link}
            type={rated < 0 ? "rateActive" : "meh"}
            onClick={e => rate(-1, e)}
            to={"meh"}
          >
            <Meh className={"icon"} strokeWidth="1.5px" color="white" />
            <Header size={styleSize}>{downs}</Header>
          </ButtonRate>
        )}
      </div>
    </StyledPost>
  );

  const renderStandAlone = () => (
    <Popup show={true} dismiss={dismiss} dismissible={true} modifier="post">
      <StyledPostOpen>
        <div className="image-container">
          {images && imageIndex > 0 && (
            <ButtonArrow
              as={Link}
              to="/"
              className="button--previous"
              onClick={e => handleImageStep(e, -1)}
            >
              {"<"}
            </ButtonArrow>
          )}
          <img className="image" src={images ? images[imageIndex] : ""} />
          {images && imageIndex < images.length - 1 && (
            <ButtonArrow
              as={Link}
              to="/"
              className="button--next"
              onClick={e => handleImageStep(e, 1)}
            >
              {">"}
            </ButtonArrow>
          )}
        </div>
        <Header
          centered
          size={3}
          as="a"
          className={"title ellipsis"}
          href={link}
          target="_blank"
        >
          {title}
        </Header>
        <UserHeader
          as={Link}
          centered={1}
          size={1}
          className={"user ellipsis"}
          to={`/user/${postedByName}`}
        >
          @{postedByName}
        </UserHeader>
        <Base className="summary">{description}</Base>
        <div className="buttons">
          <ButtonRateBig
            className={`button`}
            as={Link}
            type={"impressed"}
            rated={rated > 0 ? 1 : 0}
            onClick={e => rate(1, e)}
            to={"meh"}
          >
            <Star
              alt="Impressed!"
              className="icon impressed"
              fill={rated > 0 ? "yellow" : "none"}
              placeholder="Impressed!"
              size="40"
              strokeWidth="1.5px"
              color={rated > 0 ? "yellow" : "gray"}
            />
            <Header size={2} className={"text"}>
              {ups}
            </Header>
          </ButtonRateBig>
          <ButtonRateBig
            className={`button`}
            as={Link}
            type={"meh"}
            rated={rated < 0 ? 1 : 0}
            onClick={e => rate(-1, e)}
            to={"meh"}
          >
            <Meh
              alt="Meh..."
              className="icon meh"
              color={rated < 0 ? "black" : "gray"}
              placeholder="Meh..."
              size="40"
              strokeWidth="1.5px"
            />
            <Header size={2} className={"text"}>
              {downs}
            </Header>
          </ButtonRateBig>
          <div className="placeholder" />
          <a
            className="button"
            href={`http://www.facebook.com/sharer.php?u=${url}[title]=${title}`}
          >
            <Facebook
              alt="share on facebook"
              className="share-icon share-icon--facebook"
              strokeWidth="1.5px"
              color="#3b5998"
              size="40"
            />
          </a>
          <a className="button" href={`https://twitter.com/share?url=${url}`}>
            <Twitter
              alt="share on twitter"
              className="share-icon share-icon--twitter"
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
      </StyledPostOpen>
    </Popup>
  );

  return !type || type === "notification" ? (
    renderGridPost()
  ) : (
 renderStandAlone()
  );
}

Post.propTypes = {
  _id: Proptypes.string.isRequired,
  col: Proptypes.number,
  comments: Proptypes.number,
  description: Proptypes.string,
  dismiss: Proptypes.func,
  downs: Proptypes.number,
  images: Proptypes.array,
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
