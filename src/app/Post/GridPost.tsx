import React, { FC, useContext } from "react"
import Star from "react-feather/dist/icons/star"
import { PostsContext } from "../contexts/PostsContext"
import Meh from "../images/Meh.jsx"
// @ts-ignore
import sample from "../images/add.svg"
import { Button } from "../components"
import { Header, UserHeader } from "../Typography/Typography.style"
import {
  StyledPost,
  StyledDetailsContainer,
  StyledHeaderContainer,
} from "./Post.style"
import Loader from "../Loader.style"
import usePostData from "../hooks/usePostData"

export interface PostRateData {
  success: boolean
}

export interface PostRateVariables {
  id: string
  value: number
}

interface Props {
  id: string
  col?: number
  dismiss?: () => void
  downs: number
  images: string | string[]
  isLoading: boolean
  openPost?: () => void
  postedByName: string
  rating?: number
  row?: number
  size?: number
  title: string
  type?: string
  ups: number
}
const GridPost: FC<Props> = ({
  id,
  col,
  downs,
  images,
  isLoading,
  openPost,
  postedByName,
  rating = 0,
  row,
  size = 0,
  title,
  type,
  ups,
}) => {
  const { refetchPosts } = useContext(PostsContext)
  const { startPost, isLoading: isLoadingRating } = usePostData<
    PostRateData,
    PostRateVariables
  >(`rate`)
  const rate = async (rating: number, e: React.MouseEvent) => {
    e.preventDefault()
    await startPost({ id, value: rating })
    refetchPosts() // TODO: shouldn't refetch all post just because the rating changes on a single one
  }

  const handleClick = (e: React.MouseEvent) =>
    e.target === e.currentTarget && openPost?.()
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

  return (
    <StyledPost
      onClick={handleClick}
      style={{
        // add loader bg when isLoading === true
        background: `gray url('${
          id.length !== 20 ? images[0] : sample
        }') no-repeat center`,
        backgroundSize:
          id.length === 20 ? `70px 70px` : !type ? "cover" : "auto auto",
        gridColumn: `${!type ? "" + col + " / span " + size : "initial"}`,
        gridRow: `${!type ? "" + row + " / span " + size : "initial"}`,
      }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <StyledDetailsContainer>
          <StyledHeaderContainer>
            <Header centered size={styleSize} onClick={handleClick}>
              {title}
            </Header>
            {postedByName && (
              <UserHeader centered size={1}>
                @ {postedByName}
              </UserHeader>
            )}
          </StyledHeaderContainer>
          {title !== "Submit a post!" && type !== "notification" && (
            <Button
              isActive={rating === 1}
              isLoading={isLoadingRating}
              type={"impressed"}
              onClick={e => rate(1, e)}
              to={"impressed"}
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
              isActive={rating === -1}
              isLoading={isLoadingRating}
              type={"meh"}
              onClick={e => rate(-1, e)}
              to={"meh"}
            >
              <Meh className={"icon"} strokeWidth="1.5px" color="white" />
              <Header size={styleSize}>{downs}</Header>
            </Button>
          )}
        </StyledDetailsContainer>
      )}
    </StyledPost>
  )
}

export default GridPost
