import React, { FC, lazy, Suspense, useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Star from 'react-feather/dist/icons/star';
import { Facebook, Twitter } from 'react-feather';
import { PostsContext, Post } from '../contexts/PostsContext';
import config from '../config';
import Meh from '../images/Meh.jsx';
import Popup from '../Popup';
import sample from '../images/add.svg';
import { Button } from "../components";
import { Header, Base, UserHeader } from "../Typography/Typography.style";
import { StyledPost, StyledPostOpen } from "./Post.style";
import getYoutubeId from "../../util/getYoutubeId"

const Comments = lazy(() => import('../Comments/Comments' /* webpackChunkName: "Comments" */));

const siteUrl = config.url;

const Post: FC<Post> = ({
  id,
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
}) => {
  const [isLoading, setIsLoading] = useState(false); // specify what is loading
  const [commentCount, setCommentCount] = useState(comments)
  const [mounted, setMounted] = useState();
  const [imageIndex, setImageIndex] = useState(0);
  const [videoId, setVideoId] = useState(false);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const { getPost, updatePost } = useContext(PostsContext);
  const ref = useRef(null);
  const url = `${siteUrl}/${id}`;

  const rate = async (rating: number, e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isLoading) return

    const { setPostContext } = updatePost("post/rating", { id, rating })

    await setPostContext()
    setIsLoading(false);
  }

  const handleClick = e => e.target === e.currentTarget && openPost && openPost()

  const handleImageStep = (e, step) => {
    e.preventDefault();
    setImageIndex(index => index + step);
  }

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      setIsLoading(false);
    };
  }, []);

  useEffect(() => {
    images && setVideoId(getYoutubeId(link))
    if (images && ref && ref.current)
    // @ts-ignore
      setVideoSize({ width: ref.current.clientWidth, height: ref.current.clientHeight })
  }, [images, imageIndex])

  useEffect(() => {
    if (!title && mounted) {
      setIsLoading(true)
      const { cancel, setPostContext } = getPost(id)

      ;(async () => await setPostContext())()

      setIsLoading(false)
      return cancel
    }
  }, [mounted, id]);

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
          id.length != 20 ? images[0] : sample
        }') no-repeat center`,
        backgroundSize:
          id.length == 20 ? `70px 70px` : !type ? "cover" : "auto auto",
        gridColumn: `${!type ? "" + col + " / span " + size : "initial"}`,
        gridRow: `${!type ? "" + row + " / span " + size : "initial"}`,
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
          <Button
            className={`button`}
            active={rated === 1}
            type={"impressed"}
            onClick={e => rate(1, e)}
            to={"impressed"}
            as={Link}
          >
            <Star
              className={"icon"}
              strokeWidth="1.5px"
              color="white"
              fill={rated > 0 ? "white" : "none"}
            />
            <Header size={styleSize}>{ups}</Header>
          </Button>
        )}
        {title !== "Submit a post!" && type !== "notification" && (
          <Button
            className={`button`}
            as={Link}
            active={rated === -1}
            type={"meh"}
            onClick={e => rate(-1, e)}
            to={"meh"}
          >
            <Meh className={"icon"} strokeWidth="1.5px" color="white" />
            <Header size={styleSize}>{downs}</Header>
          </Button>
        )}
      </div>
    </StyledPost>
  )

  const renderStandAlone = () => (
    <Popup show={true} dismiss={dismiss} dismissible={true} type="post">
      <StyledPostOpen>
        <div className="image-container" ref={ref}>
          {images && imageIndex > 0 && (
            <Button
              as={Link}
              to="/"
              type="arrow"
              className="button--previous"
              onClick={e => handleImageStep(e, -1)}
            >
              {"<"}
            </Button>
          )}
          {videoId ? (
            <iframe
              width={videoSize.width}
              height={(videoSize.width / 16) * 9}
              className="image"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img className="image" src={images ? images[imageIndex] : ""} />
          )}
          {images && imageIndex < images.length - 1 && (
            <Button
              as={Link}
              to="/"
              type="arrow"
              className="button--next"
              onClick={e => handleImageStep(e, 1)}
            >
              {">"}
            </Button>
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
          <Button
            className={`button`}
            as={Link}
            type={"impressedBig"}
            rated={rated === 1}
            onClick={e => rate(1, e)}
            to={"impressed"}
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
          </Button>
          <Button
            className={`button`}
            as={Link}
            type={"mehBig"}
            rated={rated === -1}
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
          </Button>
          <div className="placeholder" />
          <a
            className="button"
            href={`http://www.facebook.com/sharer.php?u=${url}[title]=${title}`}
          >
            <Facebook
              className="share-icon share-icon--facebook"
              strokeWidth="1.5px"
              color="#3b5998"
              size="40"
            />
          </a>
          <a className="button" href={`https://twitter.com/share?url=${url}`}>
            <Twitter
              className="share-icon share-icon--twitter"
              strokeWidth="1.5px"
              color="#0084b4"
              size="40"
            />
          </a>
        </div>
        <Suspense fallback={<div>Loading comments...</div>}>
          <Comments
            commentCount={commentCount}
            setCommentCount={setCommentCount}
            idPost={id}
            type={"post"}
          />
        </Suspense>
      </StyledPostOpen>
    </Popup>
  )

  return !type || type === "notification" ? (
    renderGridPost()
  ) : (
 renderStandAlone()
  );
}

export default Post
