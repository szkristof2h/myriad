import React, { createContext, useContext, useEffect, useRef } from "react"
import useGetData from "../hooks/useGetData"
import { PostsContext } from "./PostsContext"

export interface PostRatingData extends GetRatingData {}
export interface PostRatingVariables {
  idPost: string
  value: number
}

export interface GetRatingData {
  rating: Rating
}

export interface GetRatingsData {
  ratings: Rating[]
}

export interface GetRatingsVariables {
  idPosts: string[]
}

interface RatingsContextInterface {
  isLoading: boolean
  ratings: Rating[] | undefined
  refreshRatings: () => void
}

export interface Rating {
  idPost: string
  downs: number
  ups: number
  value?: number
}

// Should find a better & easier way to provide an initial state to react contexts
const initialState: RatingsContextInterface = {
  isLoading: false,
  ratings: [],
  refreshRatings: () => {},
}
const RatingsContext = createContext<RatingsContextInterface>(initialState)

const RatingsProvider = ({ children }) => {
  const idPostsPrevious = useRef<string[]>([])
  const { idPosts } = useContext(PostsContext)
  const { data, isLoading, refetch } = useGetData<
    GetRatingsData,
    GetRatingsVariables
  >("ratings", { idPosts })
  // TODO: probably should combine this & current, so it's possible to refetch a single rating
  // const refreshRating = (idPost: string) => {
  //   setRatings(ratings => [
  //     ...(ratings?.filter(rating => rating.idPost !== newRating.idPost) ?? []),
  //     newRating,
  //   ])
  // }
  const refreshRatings = refetch

  useEffect(() => {
    if (idPosts && idPosts?.some(id => !idPostsPrevious.current.includes(id))) {
      idPostsPrevious.current = [...idPosts]
      refetch()
    }
  }, [idPosts])

  return (
    <RatingsContext.Provider
      value={{
        isLoading,
        ratings: data?.ratings,
        refreshRatings,
      }}
    >
      {children}
    </RatingsContext.Provider>
  )
}

export { RatingsProvider, RatingsContext }
