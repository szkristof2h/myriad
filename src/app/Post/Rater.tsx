import React, { FC, useContext, useEffect } from "react"
import Star from "react-feather/dist/icons/star"
import Meh from "../images/Meh.jsx"
import { Button } from "../components"
import { Header } from "../Typography/Typography.style"

import usePostData from "../hooks/usePostData"
import useGetData from "../hooks/useGetData"
import {
  GetRatingData,
  PostRatingData,
  PostRatingVariables,
  RatingsContext,
} from "../contexts/RatingsContext"
import * as Styled from "./Rater.style"

interface Props {
  headerSize: number
  idPost: string
  size: "big" | "small"
}

const Rater: FC<Props> = props => {
  const { ratings, refreshRatings } = useContext(RatingsContext)
  const { headerSize, idPost, size } = props
  const rating = ratings?.find(rating => rating.idPost === idPost)
  const { data, isLoading } = useGetData<GetRatingData>(`rating/${idPost}`)
  const {
    startPost: startPostRequest,
    isLoading: isLoadingPostRating,
  } = usePostData<PostRatingData, PostRatingVariables>(`addRating`)
  const downs = rating?.downs ?? 0
  const value = rating?.value ?? 0
  const ups = rating?.ups ?? 0
  const rate = async (value: number, e: React.MouseEvent) => {
    e.preventDefault()

    const ratingData = await startPostRequest({ idPost, value })
    const newRating = ratingData?.rating?.[0]

    if (newRating) refreshRatings(newRating)
  }

  useEffect(() => {
    if (data?.rating) refreshRatings(data?.rating)
  }, [data])

  return (
    <>
      <Styled.ButtonWrapper isActive={value === 1} type="impressed" size={size}>
        <Button
          isLoading={isLoading || isLoadingPostRating}
          onClick={e => rate(1, e)}
          to="impressed"
          type="rate"
        >
          <Star alt="Impressed!" strokeWidth="1.5px" />
          <Header size={headerSize}>{ups}</Header>
        </Button>
      </Styled.ButtonWrapper>
      <Styled.ButtonWrapper isActive={value === -1} type="meh" size={size}>
        <Button
          isLoading={isLoading || isLoadingPostRating}
          onClick={e => rate(-1, e)}
          to="meh"
          type="rate"
        >
          <Meh alt="Meh..." strokeWidth="1.5px" />
          <Header size={headerSize}>{downs}</Header>
        </Button>
      </Styled.ButtonWrapper>
    </>
  )
}

export default Rater
