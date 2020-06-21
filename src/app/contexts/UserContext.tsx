import React, { createContext, useEffect, useState, useContext } from "react"
import { Canceler } from "axios"
import { get, APIRequestInteface, post } from "../utils/api"
import { ErrorContext } from "./ErrorContext"
import { UserType } from "src/server/db/models/User"

interface GetUserInterface extends APIRequestInteface<GetUserData> {}
interface UpdateUserInterface extends APIRequestInteface<UpdateUserData> {}
interface LogoutInterface extends APIRequestInteface<{}> {}

interface GetUserData {
  user: UserData
}

interface UpdateUserData extends GetUserData {}

export interface UserData extends Omit<UserType, "idGoogle"> {
  id: string
  isBlocked: boolean
  isFollowed: boolean
}

export interface User extends UserData {}

export type CurrentUserType = (User & { isLoggedIn: boolean }) | undefined

interface UserContextInterface {
  currentUser: CurrentUserType
  logout: () => void
  getUser: (
    id: string,
    isCurrentUser?: boolean
  ) => {
    cancel: Canceler
    setUserContext: () => Promise<boolean>
  }
  updateCurrentUser: (
    variables,
    path?: string
  ) => { cancel: Canceler; setCurrentUserContext: () => Promise<boolean> }
  user: User
}

const emptyUser = {
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
  currentUser: emptyUser,
  logout: () => {},
  getUser: (id: string) => ({
    cancel: (message?: string) => {},
    setUserContext: () => new Promise(() => {}),
  }),
  updateCurrentUser: variables => ({
    cancel: (message?: string) => {},
    setCurrentUserContext: () => new Promise(() => {}),
  }),
  user: emptyUser,
}
const UserContext = createContext<UserContextInterface>(initialState)

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUserType>(emptyUser)
  const [user, setUser] = useState<User>(initialState.user)
  const { addError } = useContext(ErrorContext)

  const logout = async () => {
    const { getData, getHasFailed }: LogoutInterface = post<{}>(
      "logout",
      null,
      () => addError({ user: ["some error message here"] })
    )
    await getData()

    if (getHasFailed()) addError({ user: [`get user request failed`] })
  }

  const getUser: UserContextInterface["getUser"] = (id, isCurrentUser) => {
    const { getData, cancel, getHasFailed }: GetUserInterface = get<
      GetUserData
    >(`user${!isCurrentUser ? "/" + id : ""}`, () =>
      addError({ user: ["some error message here"] })
    )

    const setUserContext = async () => {
      const response = await getData()

      if (getHasFailed() || !response) {
        addError(`get user request failed`, "user")
        return false
      }

      const {
        data: { error, user },
      } = response

      if (error) {
        if (isCurrentUser && error.message === "NOT_LOGGED_IN") {
          setCurrentUser({ ...emptyUser, isLoggedIn: false })
        } else addError(error.message, error.type)

        return false
      }

      if (isCurrentUser) setCurrentUser({ ...user, isLoggedIn: true })
      setUser(user)
      return true
    }

    return { cancel, setUserContext }
  }

  const updateCurrentUser: UserContextInterface["updateCurrentUser"] = (
    variables,
    path
  ) => {
    const { getData, cancel, getHasFailed }: UpdateUserInterface = post<
      UpdateUserData
    >(`${path ? "user/" + path : "user"}`, variables, () =>
      addError({ user: ["some error message here"] })
    )

    const setCurrentUserContext = async () => {
      const response = await getData()

      if (getHasFailed() || !response) {
        addError({ user: [`update user request failed`] })
        return false
      }

      const {
        data: { error, user },
      } = response

      if (error) {
        if (error.message === "NOT_LOGGED_IN") {
          setCurrentUser({ ...emptyUser, isLoggedIn: false })
        } else addError(error.message, error.type)
      }

      setCurrentUser({ ...user, isLoggedIn: true })
      return true
    }

    return { cancel, setCurrentUserContext }
  }

  useEffect(() => {
    const { cancel, setUserContext } = getUser("", true)
    ;(async () => await setUserContext())()

    return cancel
  }, [])

  return (
    <UserContext.Provider
      value={{ currentUser, logout, user, getUser, updateCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider, UserContext }
