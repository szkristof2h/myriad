import React, { FC, useContext, useEffect } from "react"
import { Link, Redirect, useRouteMatch } from "react-router-dom"
import { UserContext, GetUserData, emptyUser } from "../contexts/UserContext"
import Loader from "../Loader"
import { Header, Base } from "../Typography/Typography.style"
import StyledProfile from "./Profile.style"
import { Button } from "../components"
import useGetData from "../hooks/useGetData"

interface Props {
  params?: {
    name?: string
    edit?: boolean
  }
}

const Profile: FC<Props> = ({ params }) => {
  const name = params?.name ?? ""
  const { currentUser, isLoading: isLoadingCurrentUser, logout } = useContext(
    UserContext
  )
  const isOwnProfile = !name || name === currentUser?.displayName

  // TODO: find a better way than returning an object
  const { cancel, data, isLoading, refetch } = name
    ? useGetData<GetUserData>(`user/${name}`)
    : {
        cancel: (message: string) => {},
        data: { user: emptyUser },
        isLoading: false,
        refetch: () => {},
      }
  const getUserFields = () => {
    if (!isOwnProfile && !data) return emptyUser

    const {
      avatar = "",
      bio = "",
      displayName = "",
      id,
      isBlocked = false,
      isFollowed = false,
    } = isOwnProfile && currentUser ? currentUser : data?.user ?? emptyUser

    return {
      avatar,
      bio,
      displayName,
      id,
      isBlocked,
      isFollowed,
    }
  }
  const {
    avatar,
    bio,
    displayName,
    id,
    isBlocked,
    isFollowed,
  } = getUserFields()
  const isEditing = !name && !currentUser?.displayName

  useEffect(() => {
    return cancel("unmounting")
  }, [])

  if (isLoadingCurrentUser || isLoading) return <Loader />

  if (isOwnProfile && !currentUser?.id) return <Redirect to="/login" />
  if (isEditing) return <Redirect to="/profile/edit" />

  const handleClick = async (e: React.MouseEvent, type) => {
    e.preventDefault()

    // if (isLoading) return

    // setIsLoading(true)

    // const { setCurrentUserContext } = updateCurrentUser({ id, type }, "rate")

    // params && params.name && (await setCurrentUserContext())
    // setIsLoading(false)
  }

  return (
    <StyledProfile>
      <div className="avatar">
        <img className="image" src={avatar ?? ""} alt="avatar" />
      </div>
      <Header centered className="title">
        {displayName}
      </Header>
      <Base className="bio">{bio}</Base>
      {!isOwnProfile && (
        <Button
          isActive={isFollowed}
          type="primary"
          className={`button`}
          to={`${isFollowed ? "un" : ""}follow`}
          onClick={e => handleClick(e, "follow")}
        >
          {(isFollowed ? "Unf" : "F") + "ollow!"}
        </Button>
      )}
      <Button type="primary" className="button" to={`/posts/${displayName}`}>
        Posts
      </Button>
      {!isOwnProfile && (
        <Button type="primary" className="button" to={`/message/${id}`}>
          Send a message
        </Button>
      )}
      {isOwnProfile && (
        <Button type="primary" className="button" to={`/profile/edit`}>
          Edit profile
        </Button>
      )}
      {!isOwnProfile && (
        <Button
          type="danger"
          isActive={isBlocked}
          className={`button`}
          to={`/${isBlocked ? "un" : ""}block`}
          onClick={e => handleClick(e, "block")}
        >
          {(isBlocked ? "Unb" : "B") + "lock!"}
        </Button>
      )}
      {isOwnProfile && (
        <Button
          type="danger"
          onClick={async e => {
            e.preventDefault()
            await logout()
          }}
          className={`button`}
          to="/logout"
        >
          Logout
        </Button>
      )}
    </StyledProfile>
  )
}

export default Profile
