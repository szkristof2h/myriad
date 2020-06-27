import React, { FC, useContext, useEffect } from "react"
import { Link, Redirect, Route, Switch, useRouteMatch } from "react-router-dom"
import { UserContext, GetUserData, emptyUser } from "../contexts/UserContext"
import Loader from "../Loader"
import { Header, Base } from "../Typography/Typography.style"
import StyledProfile from "./Profile.style"
import { Button } from "../components"
import EditProfile from "./EditProfile"
import useGetData from "../hooks/useGetData"

interface Props {
  params?: {
    name?: string
    edit?: boolean
  }
}

const Profile: FC<Props> = ({ params }) => {
  const hasMatchedEdit = useRouteMatch("/profile/edit")

  if (hasMatchedEdit) return <Redirect to="/edit" /> // convert to route?

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
  const isEditing = !name && (!currentUser?.displayName || hasMatchedEdit)

  useEffect(() => {
    return cancel("unmounting")
  }, [])

  if (isLoadingCurrentUser || isLoading) return <Loader />

  if (isEditing) return <Redirect to="/edit" />

  const handleClick = async (e: React.MouseEvent, type) => {
    e.preventDefault()

    // if (isLoading) return

    // setIsLoading(true)

    // const { setCurrentUserContext } = updateCurrentUser({ id, type }, "rate")

    // params && params.name && (await setCurrentUserContext())
    // setIsLoading(false)
  }

  const renderProfile = (
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
          as={Link}
          active={isFollowed}
          type="primary"
          className={`button`}
          to={`${isFollowed ? "un" : ""}follow`}
          onClick={e => handleClick(e, "follow")}
        >
          {(isFollowed ? "Unf" : "F") + "ollow!"}
        </Button>
      )}
      <Button
        type="primary"
        as={Link}
        className="button"
        to={`/posts/${displayName}`}
      >
        Posts
      </Button>
      {!isOwnProfile && (
        <Button
          type="primary"
          as={Link}
          className="button"
          to={`/message/${id}`}
        >
          Send a message
        </Button>
      )}
      {isOwnProfile && (
        <Button
          type="primary"
          as={Link}
          className="button"
          to={`/profile/edit`}
        >
          Edit profile
        </Button>
      )}
      {!isOwnProfile && (
        <Button
          as={Link}
          type="danger"
          active={isBlocked}
          className={`button`}
          to={`/${isBlocked ? "un" : ""}block`}
          onClick={e => handleClick(e, "block")}
        >
          {(isBlocked ? "Unb" : "B") + "lock!"}
        </Button>
      )}
      {isOwnProfile && (
        <Button
          as={Link}
          type="danger"
          onClick={logout}
          className={`button`}
          to="/logout"
        >
          Logout
        </Button>
      )}
    </StyledProfile>
  )

  return (
    <Switch>
      <Route
        path="/profile/edit"
        render={() => (
          <EditProfile
            avatar={avatar}
            bio={bio}
            displayName={displayName}
            refetch={refetch}
          />
        )}
      />
      <Route path={["/profile", "/user/:name"]} render={() => renderProfile} />
    </Switch>
  )
}

export default Profile
