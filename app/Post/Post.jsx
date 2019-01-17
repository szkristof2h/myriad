import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Proptypes from 'prop-types';
import axios from 'axios';
import Star from 'react-feather/dist/icons/star';
import { Facebook, Twitter } from 'react-feather';
import { ErrorContext } from '../contexts/ErrorContext.jsx';
import config from '../config';
import Meh from '../images/Meh.jsx';
import Popup from '../Popup.jsx';
import RateButton from '../RateButton.jsx';
import './post.css';
import sample from '../images/add.svg';

const Comments = lazy(() => import('../Comments/Comments.jsx' /* webpackChunkName: "Comments" */));

const siteUrl = config.url;

export default function Post({ _id, col, description, dismiss, downs, image, link, openPost, postedByName, rated, row,
  size, title, type, ups }) {
  const [currentCommentCount, setCommentCount] = useState();
  const [currentDescription, setDescription] = useState(description);
  const [currentDowns, setDowns] = useState(downs);
  const [currentId, setId] = useState(_id);
  const [currentImg, setImg] = useState(image);
  const [currentPostedBy, setPostedBy] = useState(postedByName);
  const [currentPostLink, setPostLink] = useState(link);
  const [currentRated, setRated] = useState(rated | 0);
  const [currentTitle, setTitle] = useState(title);
  const [currentUps, setUps] = useState(ups);
  const [loading, setLoading] = useState(false);
  const { setErrors } = useContext(ErrorContext);
  const url = `${siteUrl}/${currentId}`;

  const rate = (val, e) => {
    e.preventDefault();
    setLoading(true);

    !loading && axios
      .post(`${siteUrl}/post/post/rating`, { _id: currentId, rating: val })
      .then(res => {
        setLoading(false);
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else {
          if (currentRated && currentRated === val) {
            setRated(0);
            return val > 0 ? setUps(currentUps - 1) : setDowns(currentDowns - 1);
          }
          val > 0 ? setUps(currentUps + 1) : setDowns(currentDowns + 1);
          if (currentRated) val < 0 ? setUps(currentUps - 1) : setDowns(currentDowns - 1);
          setRated(val);
        }
      })
      .catch(e => setErrors(errors => [...errors, e.response.data]));
  };

  // Normal Posts get their data from their props, as the data is loaded in their parent component,
  // but if it's a focused post 
  // if it's a focused post, set its data as it doesn't get that from its props.
  useEffect(() => {
    if (!currentTitle) {
      axios
        .get(`${siteUrl}/get/post/${currentId}`)
        .then(res => {
          if (res.data.errors) setErrors(errors => [...errors, res.data]);
          else {
            setCommentCount(res.data.comments);
            setDescription(res.data.description);
            setDowns(res.data.downs);
            setImg(res.data.image);
            setPostLink(res.data.link);
            setPostedBy(res.data.postedByName);
            setRated(res.data.rated ? res.data.rated : 0);
            setTitle(res.data.title);
            setUps(res.data.ups);
          }
        });
    }
  }, [currentId]);


  const handleClick = e => e.target === e.currentTarget && openPost();

  const classType = `post post--${type && type !== 'notification' ? 'stand-alone' : size < 6 ? 'sub2'
    : size < 18 ? 'sub1' : 'main'}`;

  const postTemplate = (
    <div className={classType} onClick={e => handleClick(e)} style={{
      background: `gray url('${currentId.length != 20 ? currentImg : sample}') no-repeat center`,
      backgroundSize: currentId.length == 20 ? `70px 70px` : !type ? 'cover' : 'auto auto',
      gridColumn: `${!type ? '' + col + ' / span ' + size : 'initial'}`,
      gridRow: `${!type ? '' + row + ' / span ' + size : 'initial'}`
    }}>
      <div className="post__details">
        <div className="post__personal">
          <h2 className={"post__title ellipsis"}>{title}</h2>
          <h2 className={"post__user ellipsis"}>@ {currentPostedBy}</h2>
        </div>
        {currentTitle !== 'Submit a post!' && <RateButton
          className={`post__button post__button${currentRated > 0 ? '--rated' : ''}`}
          icon={<Star strokeWidth="1.5px" color="white" fill={currentRated > 0 ? "white" : "none"} />}
          handleClick={e => rate(1, e)}
          prefix={'post'}
          text={currentUps}
          to={'impressed'}
        />}
        {currentTitle !== 'Submit a post!' && <RateButton
          className={`post__button post__button--meh post__button${currentRated < 0 ? '--rated' : ''}`}
          icon={<Meh strokeWidth="1.5px" color="white" />}
          handleClick={e => rate(-1, e)}
          prefix={'post'}
          text={currentDowns}
          to={'meh'}
        />}
      </div>
    </div>
  );

  return (
    !type || type === 'notification' ? postTemplate :
      <Popup show={true} dismiss={dismiss} dismissible={true} modifier="post">
        <div className="post--stand-alone">
          <div className="post__image-container">
            <img className="post__image"  src={currentImg} />
          </div>
          <a className={"post__title ellipsis"} href={currentPostLink} target="_blank">{currentTitle}</a>
          <Link className={"post__user ellipsis"} to={`/user/${currentPostedBy}`} >@{currentPostedBy}</Link>
          <div className="post__summary">
            {currentDescription}
          </div>
          <div className="post__buttons">
            <RateButton
              className={`post__button post__button--main post__button${currentRated > 0 ? '--rated' : ''}`}
              icon={
                <Star
                  alt="Impressed!"
                  className="post__icon post__impressed"
                  fill={currentRated > 0 ?  "yellow" : "none"}
                  placeholder="Impressed!"
                  size="40"
                  strokeWidth="1.5px" color={currentRated > 0 ?  "yellow" : "gray"}
                />}
              handleClick={e => rate(1, e)}
              prefix={'post'}
              text={currentUps}
              to={'impressed'}
            />
            <RateButton
              className={`post__button post__button--main post__button--meh post__button${currentRated < 0 ? '--rated' : ''}`}
              icon={
                <Meh
                  alt="Meh..."
                  className="post__icon post__meh"
                  color={currentRated < 0 ? "black" : "gray"}
                  placeholder="Meh..."
                  size="40"
                  strokeWidth="1.5px"
                />}
              handleClick={e => rate(-1, e)}
              prefix={'post'}
              text={currentDowns}
              to={'meh'}
            />
            <div className="palceholder"></div>
            <a className="post__button post__button--main" href={`http://www.facebook.com/sharer.php?u=${url}[title]=${currentTitle}`}>
              <Facebook alt="share on facebook" className="post__share-icon post__share-icon--facebook" strokeWidth="1.5px" color="#3b5998" size="40" />
            </a>
            <a className="post__button post__button--main" href={`https://twitter.com/share?url=${url}`}>
              <Twitter alt="share on twitter" className="post__share-icon post__share-icon--twitter" strokeWidth="1.5px" color="#0084b4" size="40" />
            </a>
          </div>
          <Suspense fallback={<div>Loading comments...</div>}>
              <Comments closePost={dismiss} count={currentCommentCount} id={currentId} type={'post'} />
          </Suspense>
        </div>
      </Popup>
  );
}

Post.propTypes = {
  _id: Proptypes.string.isRequired,
  col: Proptypes.number,
  description: Proptypes.string,
  dismiss: Proptypes.func,
  downs: Proptypes.number,
  image: Proptypes.string,
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
