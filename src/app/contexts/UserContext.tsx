import React, { createContext, useContext } from "react"
import { APIRequestInteface, post } from "../requests/api"
import { ErrorContext } from "./ErrorContext"
import { UserType } from "src/server/db/models/User"
import useGetData from "../hooks/useGetData"
import usePostData from "../hooks/usePostData"

interface PostLogoutData {
  success: boolean
}

export interface GetUserData {
  user: UserData
}

export interface UserData extends Omit<UserType, "idGoogle"> {
  id: string
  isBlocked: boolean
  isFollowed: boolean
}

export interface User extends UserData {}

interface UserContextInterface {
  currentUser: User | undefined
  isLoading: boolean
  logout: () => Promise<void>
  refetch: () => void
}

export const emptyUser = {
  id: "",
  avatar: "",
  bio: "",
  displayName: "",
  googleId: "",
  firstName: "",
  lastName: "",
  isLoggedIn: false,
  isBlocked: false,
  isFollowed: false,
}

// TODO: Should find a better & easier way to provide an initial state to react contexts
const initialState: UserContextInterface = {
  currentUser: undefined,
  isLoading: true,
  logout: () => new Promise(() => {}),
  refetch: () => {},
}
const UserContext = createContext<UserContextInterface>(initialState)

const UserProvider = ({ children }) => {
  const { data: currentUserData, isLoading, refetch } = useGetData<GetUserData>(
    "user"
  )
  const { startPost } = usePostData<PostLogoutData, null>(`logout`, null)

  const logout = async () => {
    await startPost()
    refetch()
  }

  return (
    <UserContext.Provider
      value={{ currentUser: currentUserData?.user, isLoading, logout, refetch }}
    >
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider, UserContext }
