import React, { createContext, useEffect, useState, useContext } from 'react'
import { Canceler } from 'axios'
import { get, APIRequestInteface, post } from '../utils/api'
import { ErrorContext } from './ErrorContext'

// TODO: add error type
interface GetUserInterface extends APIRequestInteface<GetUserData> {}
interface UpdateUserInterface extends APIRequestInteface<UpdateUserData> {}
interface LogoutInterface extends APIRequestInteface<{}> {}

interface GetUserData {
  user: UserData
  error?: {}
}

interface UpdateUserData extends GetUserData {}

interface UserData {
  id: string
  avatar: string
  bio: string
  blocked: boolean
  firstName: string
  followed: boolean
  displayName: string
  lastName: string
  logged?: boolean
}

export interface User extends UserData {}

interface UserContextInterface {
  currentUser: User | null
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
    path?: string,
  ) => { cancel: Canceler; setCurrentUserContext: () => Promise<boolean> }
  user: User
}

// Should find a better & easier way to provide an initial state to react contexts
const initialState: UserContextInterface = {
  currentUser: null,
  logout: () => {},
  getUser: (id: string) => ({
    cancel: (message?: string) => {},
    setUserContext: () => new Promise(() => {}),
  }),
  updateCurrentUser: (variables) => ({
    cancel: (message?: string) => {},
    setCurrentUserContext: () => new Promise(() => {}),
  }),
  user: {
    id: '',
    avatar: '',
    bio: '',
    blocked: false,
    firstName: '',
    followed: false,
    displayName: '',
    lastName: '',
    logged: false,
  },
}
const UserContext = createContext<UserContextInterface>(initialState)

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [user, setUser] = useState<User>(initialState.user)
  const { addError } = useContext(ErrorContext)

  const logout = async () => {
    const { getData, getHasFailed }: LogoutInterface = post<{}>(
      'logout',
      null,
      () => addError({ user: ['some error message here']})
    )
    await getData()

    if (getHasFailed())
      addError({ user: [`get user request failed`]})
  }

  const getUser: UserContextInterface['getUser'] = (id, isCurrentUser) => {
    const { getData, cancel, getHasFailed }: GetUserInterface = get<
      GetUserData
    >(`user${!isCurrentUser ? '/' + id : ''}`, () =>
      addError({ user: ['some error message here']})
    )

    const setUserContext = async () => {
      const response = await getData()

      if (getHasFailed() || !response) {
        addError({ user: [`get user request failed`]})
        return false
      }

      const {
        data: { error, user },
      } = response

      if (error) {
        addError(error)
        return false
      }

      if (isCurrentUser) setCurrentUser(user)
      setUser(user)
      return true
    }

    return { cancel, setUserContext }
  }

  const updateCurrentUser: UserContextInterface['updateCurrentUser'] = (
    variables,
    path
  ) => {
    const { getData, cancel, getHasFailed }: UpdateUserInterface = post<
      UpdateUserData
    >(`${path ? 'user/' + path : 'user'}`, variables, () =>
      addError({ user: ['some error message here']})
    )

    const setCurrentUserContext = async () => {
      const response = await getData()

      if (getHasFailed() || !response) {
        addError({ user: [`update user request failed`]})
        return false
      }

      const {
        data: { error, user },
      } = response

      if (error) {
        addError(error)
        return false
      }

      setCurrentUser(user)
      return true
    }

    return { cancel, setCurrentUserContext }
  }

  useEffect(() => {
    const { cancel, setUserContext } = getUser('', true)
    ;(async () => await setUserContext())()

    return cancel
  }, [])

  return (
    <UserContext.Provider value={{ currentUser, logout, user, getUser, updateCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider, UserContext }
