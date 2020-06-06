import React, {
  FC,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react"
import { Link } from "react-router-dom"
import Star from "react-feather/dist/icons/star"
import { Facebook, Twitter } from "react-feather"
import { PostsContext, Post as PostProps } from "../contexts/PostsContext"
import config from "../config"
import Meh from "../images/Meh.jsx"
import Popup from "../Popup"
// @ts-ignore
import sample from "../images/add.svg"
import { Button } from "../components"
import { Header, UserHeader } from "../Typography/Typography.style"
import {
  StyledNavigationButton,
  StyledPost,
  StyledPostOpen,
  StyledDetailsContainer,
  StyledHeaderContainer,
  StyledImageContainer,
  StyledMainImage,
  StyledMainVideo,
  StyledSummary,
  StyledButtonContainer,
} from "./Post.style"
import getYoutubeId from "../../util/getYoutubeId"
import theme from "../theme"

const Comments = lazy(() =>
  import("../Comments/Comments" /* webpackChunkName: "Comments" */)
)

const siteUrl = config.url

const Post: FC<PostProps> = ({
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
  rating = 0,
  row,
  size,
  title,
  type,
  ups,
}) => {
  const [isLoading, setIsLoading] = useState(false) // specify what is loading
  const [commentCount, setCommentCount] = useState(comments)
  const [mounted, setMounted] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const [videoId, setVideoId] = useState(false)
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 })
  const { getPost, updatePost } = useContext(PostsContext)
  const ref = useRef(null)
  const url = `${siteUrl}/${id}`

  const rate = async (rating: number, e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!isLoading) return

    const { setPostContext } = updatePost("post/rating", { id, rating })

    await setPostContext()
    setIsLoading(false)
  }

  const handleClick = (e: React.MouseEvent) =>
    e.target === e.currentTarget && openPost && openPost()

  const handleImageStep = (e: React.MouseEvent, step: number) => {
    e.preventDefault()
    setImageIndex(index => index + step)
  }

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    images && setVideoId(getYoutubeId(link))
    if (images && ref && ref.current)
      setVideoSize({
        // @ts-ignore
        width: ref?.current?.clientWidth,
        // @ts-ignore
        height: ref?.current?.clientHeight,
      })
  }, [images, imageIndex])

  useEffect(() => {
    if (!title && mounted) {
      setIsLoading(true)
      const { cancel, setPostContext } = getPost(id)
      ;(async () => await setPostContext())()

      setIsLoading(false)
      return cancel
    }
  }, [mounted, id])

  const classType = `post ${
    type && type !== "notification"
      ? "stand-alone"
      : size < 6
      ? "sub2"
      : size < 18
      ? "sub1"
      : "main"
  }`

  const styleSize = classType.includes("main")
    ? 2
    : classType.includes("sub2")
    ? -1
    : 1

  const renderGridPost = () => (
    <StyledPost
      onClick={handleClick}
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
      <StyledDetailsContainer>
        <StyledHeaderContainer>
          <Header centered size={styleSize} onClick={handleClick}>
            {title}
          </Header>
          {postedByName && (
            <UserHeader centered size={1}>
              // add ellipsis? @ {postedByName}
            </UserHeader>
          )}
        </StyledHeaderContainer>
        {title !== "Submit a post!" && type !== "notification" && (
          <Button
            active={rating === 1}
            type={"impressed"}
            onClick={e => rate(1, e)}
            to={"impressed"}
            as={Link}
          >
            <Star
              className={"icon"}
              strokeWidth="1.5px"
              color="white"
              fill={rating > 0 ? "white" : "none"}
            />
            <Header size={styleSize}>{ups}</Header>
          </Button>
        )}
        {title !== "Submit a post!" && type !== "notification" && (
          <Button
            as={Link}
            active={rating === -1}
            type={"meh"}
            onClick={e => rate(-1, e)}
            to={"meh"}
          >
            <Meh className={"icon"} strokeWidth="1.5px" color="white" />
            <Header size={styleSize}>{downs}</Header>
          </Button>
        )}
      </StyledDetailsContainer>
    </StyledPost>
  )

  const renderStandAlone = () => (
    <Popup show={true} dismiss={dismiss} dismissible={true} type="post">
      <StyledPostOpen>
        <StyledImageContainer ref={ref}>
          {images && imageIndex > 0 && (
            <StyledNavigationButton
              as={Link}
              to="/"
              type="arrow"
              onClick={(e: React.MouseEvent) => handleImageStep(e, -1)}
              style={{
                left: `${theme.base.gutter * 2}px`,
              }}
            >
              {"<"}
            </StyledNavigationButton>
          )}
          {videoId ? (
            <StyledMainVideo
              width={videoSize.width}
              height={(videoSize.width / 16) * 9}
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <StyledMainImage src={images ? images[imageIndex] : ""} />
          )}
          {images && imageIndex < images.length - 1 && (
            <StyledNavigationButton
              as={Link}
              to="/"
              type="arrow"
              onClick={(e: React.MouseEvent) => handleImageStep(e, 1)}
              style={{
                right: `${theme.base.gutter * 2}px`,
              }}
            >
              {">"}
            </StyledNavigationButton>
          )}
        </StyledImageContainer>
        <Header centered size={3} as="a" href={link} target="_blank">
          {title}
        </Header>
        <UserHeader
          as={Link}
          centered={1}
          size={1}
          to={`/user/${postedByName}`}
        >
          @{postedByName}
        </UserHeader>
        <StyledSummary>{description}</StyledSummary>
        <StyledButtonContainer>
          <Button
            as={Link}
            type={"impressedBig"}
            rated={rating === 1}
            onClick={e => rate(1, e)}
            to={"impressed"}
          >
            <Star
              // @ts-ignore
              alt="Impressed!"
              className="icon impressed"
              fill={rating > 0 ? "yellow" : "none"}
              placeholder="Impressed!"
              size="40"
              strokeWidth="1.5px"
              color={rating > 0 ? "yellow" : "gray"}
            />
            <Header size={2}>{ups}</Header>
          </Button>
          <Button
            as={Link}
            type={"mehBig"}
            rated={rating === -1}
            onClick={e => rate(-1, e)}
            to={"meh"}
          >
            <Meh
              // @ts-ignore
              alt="Meh..."
              className="icon meh"
              color={rating < 0 ? "black" : "gray"}
              placeholder="Meh..."
              size="40"
              strokeWidth="1.5px"
            />
            <Header size={2}>{downs}</Header>
          </Button>
          <div />
          <a
            href={`http://www.facebook.com/sharer.php?u=${url}[title]=${title}`}
          >
            <Facebook
              className="share-icon share-icon--facebook"
              strokeWidth="1.5px"
              color="#3b5998"
              size="40"
            />
          </a>
          <a href={`https://twitter.com/share?url=${url}`}>
            <Twitter
              className="share-icon share-icon--twitter"
              strokeWidth="1.5px"
              color="#0084b4"
              size="40"
            />
          </a>
        </StyledButtonContainer>
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

  return !type || type === "notification"
    ? renderGridPost()
    : renderStandAlone()
}

export default Post
