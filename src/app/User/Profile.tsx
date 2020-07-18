import React, { FC, useContext, useEffect } from "react"
import { Link, Redirect, useRouteMatch } from "react-router-dom"
import { UserContext, GetUserData, emptyUser } from "../contexts/UserContext"
import Loader from "../Loader"
import { Header, Base } from "../Typography/Typography.style"
import * as Styled from "./Profile.style"
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

  const { data, isLoading, refetch } = useGetData<GetUserData>(
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
    <Styled.Profile>
      <Styled.AvatarWrapper>
        <img src={avatar ?? ""} alt="avatar" />
      </Styled.AvatarWrapper>
      <Header centered>{displayName}</Header>
      <Base>{bio}</Base>
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
      <Button type="primary" to={`/posts/${displayName}`}>
        Posts
      </Button>
      {!isOwnProfile && (
        <Button type="primary" to={`/message/${displayName}`}>
          Send a message
        </Button>
      )}
      {isOwnProfile && (
        <Button type="primary" to={`/profile/edit`}>
          Edit profile
        </Button>
      )}
      {!isOwnProfile && (
        <Button
          type="danger"
          isActive={isBlocked}
          isLoading={isLoadingBlock || isLoadingUnBlock}
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
          to="/logout"
        >
          Logout
        </Button>
      )}
    </Styled.Profile>
  )
}

export default Profile
