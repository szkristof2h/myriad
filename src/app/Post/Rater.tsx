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
  RatingsProvider,
} from "../contexts/RatingsContext"

interface Props {
  headerSize: number
  idPost: string
  size: string
}

const Rater: FC<Props> = props => {
  const { ratings, refreshRatings } = useContext(RatingsContext)
  const { headerSize, idPost, size = 0 } = props
  const rating = ratings?.find(rating => rating.idPost === idPost)
  const { data, isLoading } = useGetData<GetRatingData>(`rate/${idPost}`)
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

  const iconStyles = {
    small: {
      up: {
        color: "white",
      },
      down: {
        color: "white",
      },
    },
    big: {
      up: {
        color: value < 0 ? "black" : "gray",
        fill: value > 0 ? "yellow" : "none",
        size: 40,
      },
      down: {
        color: value > 0 ? "yellow" : "gray",
        fill: value < 0 ? "black" : "gray",
        size: 40,
      },
    },
  }

  return (
    <RatingsProvider>
      <Button
        isActive={value === 1}
        isLoading={isLoading || isLoadingPostRating}
        type="impressed"
        onClick={e => rate(1, e)}
        to="impressed"
      >
        <Star alt="Impressed!" strokeWidth="1.5px" {...iconStyles[size].up} />
        <Header size={headerSize}>{ups}</Header>
      </Button>
      <Button
        isActive={value === -1}
        isLoading={isLoading || isLoadingPostRating}
        type="meh"
        onClick={e => rate(-1, e)}
        to="meh"
      >
        <Meh alt="Meh..." strokeWidth="1.5px" {...iconStyles[size].down} />
        <Header size={headerSize}>{downs}</Header>
      </Button>
    </RatingsProvider>
  )
}

export default Rater
