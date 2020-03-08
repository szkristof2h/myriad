import React, { FC, useContext, useEffect, useState } from 'react';
import {
  Link,
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom'
import { ErrorContext } from '../contexts/ErrorContext';
import { UserContext } from '../contexts/UserContext';
import Loader from '../Loader';
import { Header, Base } from "../Typography/Typography.style";
import StyledProfile from "./Profile.style"
import { Button } from "../components";
import EditProfile from "./EditProfile";
import { APIRequestInteface, get } from '../utils/api';

interface Props {
  params?: {
    name?: string
    edit?: boolean
  }
}

type GetIsNameAvailable = (name: string) => Promise<void>
interface IsNameAvailableRequest extends APIRequestInteface<IsNameAvailableData> {}
interface IsNameAvailableData { error: {  } }

const Profile: FC<Props> = ({ params }) => {
  const hasMatchedEdit = useRouteMatch('/profile/edit')
  let history = useHistory()
  const { currentUser, getUser, logout, updateCurrentUser, user } = useContext(
    UserContext
  )
  const { addError } = useContext(ErrorContext)
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const id = params?.name ?? ''
  const { avatar, blocked, bio, displayName, followed } =
    id === currentUser?.id ? currentUser : user
  const [newProfile, setNewProfile] = useState({ avatar, bio, displayName })
  const isEditing = !id && (!displayName || hasMatchedEdit)

  useEffect(() => {
    setIsLoading(true)
    const { cancel, setUserContext } = getUser(id, !!id)
    ;(async () => await setUserContext())()

    setIsLoading(false)
    return cancel
  }, [id])

  useEffect(() => {
    setIsNameAvailable(null)
  }, [displayName])

  const getIsNameAvailable: GetIsNameAvailable = async (name: string) => {
    const { getData, getHasFailed }: IsNameAvailableRequest = get<
      IsNameAvailableData
    >(`user/displayName/${name}`, () =>
      addError({ profile: ['some error message here']})
    )

    const response = await getData()

    if (getHasFailed() || !response)
      return addError({ profile: [`get is name available request failed`]})

    const {
      data: { error },
    } = response

    if (Object.keys(error).length) setIsNameAvailable(true)
    else {
      addError(error)
      setIsNameAvailable(false)
    }
  }

  const handleCheck = async (e: React.MouseEvent) => {
    e.preventDefault()
    await getIsNameAvailable(displayName)
  }

  const handleClick = async (e: React.MouseEvent, type) => {
    e.preventDefault()

    if (isLoading) return

    setIsLoading(true)

    const { setCurrentUserContext } = updateCurrentUser({ id, type }, 'rate')

    params && params.name && (await setCurrentUserContext())
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (isLoading) return

    setIsLoading(true)

    if (!currentUser) {
      setIsLoading(false)
      return
    }

    // add validation
    const newValues = Object.keys(newProfile).reduce(
      (acc, key) =>
        newProfile[key] === currentUser[key]
          ? acc
          : { ...acc, [key]: newProfile[key] },
      {}
    )

    if (Object.keys(newValues).length === 0) {
      addError({ profile: ["You haven't change any of your data."]})
      setIsLoading(false)
      return
    }

    const { setCurrentUserContext } = updateCurrentUser(
      newValues,
      `user/profile`
    )
    const success = await setCurrentUserContext()
    setIsLoading(false)
    setNewProfile({ avatar, bio, displayName })
    success && history.push("/profile")
  }

  if (isLoading) return <Loader />
  if (isEditing && !hasMatchedEdit) return <Redirect to="/edit" />

  const renderProfile = (
    <StyledProfile>
      <div className="avatar">
        <img className="image" src={avatar ?? ""} alt="avatar" />
      </div>
      <Header centered className="title">
        {displayName}
      </Header>
      <Base className="bio">{bio}</Base>
      {id !== user.id && (
        <Button
          as={Link}
          active={followed}
          type="primary"
          className={`button`}
          to={`${followed ? "un" : ""}follow`}
          onClick={e => handleClick(e, "follow")}
        >
          {(followed ? "Unf" : "F") + "ollow!"}
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
      {id !== user.id && (
        <Button
          type="primary"
          as={Link}
          className="button"
          to={`/message/${id}`}
        >
          Send a message
        </Button>
      )}
      {id === user.id && (
        <Button
          type="primary"
          as={Link}
          className="button"
          to={`/profile/edit`}
        >
          Edit profile
        </Button>
      )}
      {id !== user.id && (
        <Button
          as={Link}
          type="danger"
          active={blocked}
          className={`button`}
          to={`/${blocked ? "un" : ""}block`}
          onClick={e => handleClick(e, "block")}
        >
          {(blocked ? "Unb" : "B") + "lock!"}
        </Button>
      )}
      {id === user.id && (
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
            isNameAvailable={isNameAvailable}
            newProfile={newProfile}
            handleCheck={handleCheck}
            handleSubmit={handleSubmit}
            setNewProfile={setNewProfile}
          />
        )}
      />
      <Route path={['/profile', '/user/:name']} render={() => renderProfile} />
    </Switch>
  )
}


export default Profile