import React, { FC, useContext, useEffect } from "react"
import { Link, Redirect, useRouteMatch } from "react-router-dom"
import { UserContext, GetUserData, emptyUser } from "../contexts/UserContext"
import Loader from "../Loader"
import { Header, Base } from "../Typography/Typography.style"
import StyledProfile from "./Profile.style"
import { Button } from "../components"
import useGetData from "../hooks/useGetData"
import usePostData from "../hooks/usePostData"

interface Props {
  params?: {
    name?: string
    edit?: boolean
  }
}

export interface PostBlockData {
  status: "success" | "failed"
}

interface PostBlockVariables {
  idTarget: string
}

export interface PostUnBlockData {
  status: "success" | "failed"
}

interface PostUnBlockVariables {
  idTarget: string
}

export interface PostFollowData {
  status: "success" | "failed"
}

interface PostFollowVariables {
  idTarget: string
}

export interface PostUnFollowData {
  status: "success" | "failed"
}

interface PostUnFollowVariables {
  idTarget: string
}

const Profile: FC<Props> = ({ params }) => {
  const name = params?.name ?? ""
  const { currentUser, isLoading: isLoadingCurrentUser, logout } = useContext(
    UserContext
  )
  const isOwnProfile = !name || name === currentUser?.displayName

  // TODO: find a better way than returning an object
  const { cancel, data, isLoading, refetch } = useGetData<GetUserData>(
    name ? `user/${name}` : ""
  )

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
  const {
    startPost: startPostBlockRequest,
    isLoading: isLoadingBlock,
  } = usePostData<PostBlockData, PostBlockVariables>(`user/block`)
  const {
    startPost: startPostUnBlockRequest,
    isLoading: isLoadingUnBlock,
  } = usePostData<PostUnBlockData, PostUnBlockVariables>(`user/unblock`)
  const {
    startPost: startPostFollowRequest,
    isLoading: isLoadingFollow,
  } = usePostData<PostFollowData, PostFollowVariables>(`user/follow`)
  const {
    startPost: startPostUnFollowRequest,
    isLoading: isLoadingUnFollow,
  } = usePostData<PostUnFollowData, PostUnFollowVariables>(`user/unfollow`)

  if (!isLoadingCurrentUser && !isLoading && isOwnProfile && !currentUser?.id)
    return <Redirect to="/login" />

  if (!isLoadingCurrentUser && isEditing) return <Redirect to="/profile/edit" />

  const handleClick = async (
    e: React.MouseEvent,
    type: "block" | "unblock" | "follow" | "unfollow"
  ) => {
    e.preventDefault()

    if (
      !isLoadingBlock &&
      !isLoadingUnBlock &&
      !isLoadingFollow &&
      !isLoadingUnFollow
    ) {
      if (type === "block") await startPostBlockRequest({ idTarget: id })
      else if (type === "unblock")
        await startPostUnBlockRequest({ idTarget: id })
      else if (type === "follow") await startPostFollowRequest({ idTarget: id })
      else if (type === "unfollow")
        await startPostUnFollowRequest({ idTarget: id })

      refetch()
    }
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
          isLoading={isLoadingFollow || isLoadingUnFollow}
          type="primary"
          className={`button`}
          to={`${isFollowed ? "un" : ""}follow`}
          onClick={e => handleClick(e, isFollowed ? "unfollow" : "follow")}
        >
          {(isFollowed ? "Unf" : "F") + "ollow!"}
        </Button>
      )}
      <Button type="primary" className="button" to={`/posts/${displayName}`}>
        Posts
      </Button>
      {!isOwnProfile && (
        <Button
          type="primary"
          className="button"
          to={`/message/${displayName}`}
        >
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
          isLoading={isLoadingBlock || isLoadingUnBlock}
          className={`button`}
          to={`/${isBlocked ? "un" : ""}block`}
          onClick={e => handleClick(e, isBlocked ? "unblock" : "block")}
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
