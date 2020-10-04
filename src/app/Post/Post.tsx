import React, { FC, lazy, Suspense, useEffect, useState, useRef } from "react"
import { Facebook, Twitter } from "react-feather"
import { GetPostData, samplePost } from "../contexts/PostsContext"
import config from "../config"
import Popup from "../Popup"
import { Header, UserHeader } from "../Typography/Typography.style"
import {
  StyledNavigationButton,
  StyledPostOpen,
  StyledImageContainer,
  StyledMainImage,
  StyledMainVideo,
  StyledSummary,
  StyledButtonContainer,
} from "./Post.style"
import getYoutubeId from "../../util/getYoutubeId"
import theme from "../theme"
import useGetData from "../hooks/useGetData"
import Loader from "../Loader.style"
import Rater from "./Rater"

const Comments = lazy(() =>
  import("../Comments/Comments" /* webpackChunkName: "Comments" */)
)
const siteUrl = config.url

interface Props {
  id: string
  dismiss: () => void
}

const Post: FC<Props> = ({ id, dismiss }) => {
  const [imageIndex, setImageIndex] = useState(0)
  const [idVideo, setIdVideo] = useState<string | false>("")
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 })
  const ref = useRef(null)
  const { data, isLoading } = useGetData<GetPostData>(`post/${id}`)
  const handleImageStep = (e: React.MouseEvent, step: number) => {
    e.preventDefault()
    setImageIndex(index => index + step)
  }
  const url = `${siteUrl}/${id}`
  const {
    comments: commentCount,
    createdAt,
    description,
    link,
    images,
    postedByName,
    tags,
    title,
  } = data?.post ?? samplePost

  useEffect(() => {
    images && setIdVideo(getYoutubeId(link))
    if (images && ref && ref.current)
      setVideoSize({
        // @ts-ignore
        width: ref?.current?.clientWidth,
        // @ts-ignore
        height: ref?.current?.clientHeight,
      })
  }, [images, imageIndex])

  const renderMedia = () => {
    if (isLoading) return <Loader />

    return (
      <>
        {images && imageIndex > 0 && (
          <StyledNavigationButton
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
        {idVideo ? (
          <StyledMainVideo
            width={videoSize.width}
            height={(videoSize.width / 16) * 9}
            src={`https://www.youtube.com/embed/${idVideo}`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <StyledMainImage src={images ? images[imageIndex] : ""} />
        )}
        {images && imageIndex < images.length - 1 && (
          <StyledNavigationButton
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
      </>
    )
  }

  return (
    <Popup show={true} dismiss={dismiss} dismissible={true} type="post">
      <StyledPostOpen>
        <StyledImageContainer ref={ref}>{renderMedia()}</StyledImageContainer>
        <Header centered size={3} as="a" href={link} target="_blank">
          {title}
        </Header>
        <UserHeader centered={1} size={1} to={`/user/${postedByName}`}>
          @{postedByName}
        </UserHeader>
        <StyledSummary>{description}</StyledSummary>
        <StyledButtonContainer>
          <Rater idPost={id} headerSize={2} size="big" />
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
          <Comments idParent={id} type={"post"} commentCount={commentCount} />
        </Suspense>
      </StyledPostOpen>
    </Popup>
  )
}

export default Post
