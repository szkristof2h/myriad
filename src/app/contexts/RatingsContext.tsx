import React, { createContext, useState } from "react"
import { APIRequestInteface } from "../requests/api"

export interface GetRatingData extends APIRequestInteface<GetRating> {}
export interface PostRatingData extends GetRating {}
export interface PostRatingVariables {
  idPost: string
  value: number
}

export interface GetRating {
  rating: Rating
}

interface RatingsContextInterface {
  ratings: Rating[] | undefined
  refreshRatings: (rating: Rating) => void
}

export interface Rating {
  idPost: string
  downs: number
  ups: number
  value: number
}

// Should find a better & easier way to provide an initial state to react contexts
const initialState: RatingsContextInterface = {
  ratings: [],
  refreshRatings: (rating: Rating) => {},
}
const RatingsContext = createContext<RatingsContextInterface>(initialState)

const RatingsProvider = ({ children }) => {
  const [ratings, setRatings] = useState<Rating[]>()
  const refreshRatings = (newRating: Rating) => {
    setRatings(ratings => [
      ...ratings?.filter(
        rating => rating.idPost !== newRating.idPost,
        newRating
      ),
    ])
  }

  return (
    <RatingsContext.Provider
      value={{
        ratings,
        refreshRatings,
      }}
    >
      {children}
    </RatingsContext.Provider>
  )
}

export { RatingsProvider, RatingsContext }
