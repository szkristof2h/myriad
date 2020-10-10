import React, { FC } from "react"
// @ts-ignore
import { Header, UserHeader } from "../Typography/Typography.style"
import * as Styled from "./GridPost.style"
import Loader from "../Loader.style"
import Rater from "./Rater"

interface Props {
  id: string
  column?: number
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
    column,
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
  const gridSize = size === 5 ? "small" : size === 6 ? "medium" : "big"

  return (
    <Styled.GridPost
      column={column}
      gridSize={gridSize}
      image={images[0]}
      isSample={id.length === 20}
      row={row}
      size={size}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Styled.DetailsContainer onClick={handleClick}>
          <Styled.HeaderContainer gridSize={gridSize}>
            <Header centered size={headerSize} onClick={handleClick}>
              {title}
            </Header>
            {postedByName && (
              <UserHeader centered size={1}>
                @ {postedByName}
              </UserHeader>
            )}
          </Styled.HeaderContainer>
          {title !== "Submit a post!" && type !== "notification" && (
            <Rater headerSize={headerSize} idPost={id} size="small" />
          )}
        </Styled.DetailsContainer>
      )}
    </Styled.GridPost>
  )
}

GridPost.displayName = "GridPost"

export default GridPost
