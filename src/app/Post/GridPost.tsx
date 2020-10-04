import React, { FC } from "react"
// @ts-ignore
import sample from "../images/add.svg"
import { Header, UserHeader } from "../Typography/Typography.style"
import {
  StyledPost,
  StyledDetailsContainer,
  StyledHeaderContainer,
} from "./Post.style"
import Loader from "../Loader.style"
import Rater from "./Rater"

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
const GridPost: FC<Props> = props => {
  const {
    id,
    col,
    images,
    isLoading,
    openPost,
    postedByName,
    row,
    size = 0,
    title,
    type,
  } = props

  const handleClick = (e: React.MouseEvent) => {
    e.target === e.currentTarget && openPost?.()
  }

  const headerSize = size < 6 ? -1 : 1

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
            <Header centered size={headerSize} onClick={handleClick}>
              {title}
            </Header>
            {postedByName && (
              <UserHeader centered size={1}>
                @ {postedByName}
              </UserHeader>
            )}
          </StyledHeaderContainer>
          {title !== "Submit a post!" && type !== "notification" && (
            <Rater headerSize={headerSize} idPost={id} size="small" />
          )}
        </StyledDetailsContainer>
      )}
    </StyledPost>
  )
}

export default GridPost
