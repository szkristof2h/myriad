import React, { createContext, useContext } from "react"
import { APIRequestInteface, post } from "../requests/api"
import { ErrorContext } from "./ErrorContext"
import { UserType } from "src/server/db/models/User"
import useGetData from "../hooks/useGetData"

interface LogoutInterface extends APIRequestInteface<{}> {}

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
  logout: () => void
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
  logout: () => {},
  refetch: () => {},
}
const UserContext = createContext<UserContextInterface>(initialState)

const UserProvider = ({ children }) => {
  const { addError } = useContext(ErrorContext)
  const { data: currentUserData, isLoading, refetch } = useGetData<GetUserData>(
    "user"
  )

  const logout = async () => {
    const { getData, getHasFailed }: LogoutInterface = post<{}>(
      "logout",
      null,
      () => addError({ user: ["some error message here"] })
    )

    await getData()

    if (getHasFailed()) addError({ user: [`get user request failed`] })
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
