import React, { FC, useContext, useEffect, useState, SyntheticEvent } from 'react';
import {
  Link,
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom'
import { ErrorContext } from '../contexts/ErrorContext.jsx';
import { UserContext } from '../contexts/UserContext.jsx';
import Loader from '../Loader';
import { Header, Base } from "../Typography/Typography.style";
import StyledProfile from "./Profile.style"
import { Button, ButtonError } from "../components/Button.style";
import EditProfile from "./EditProfile.jsx";
import { APIRequestInteface, get } from '../utils/api.js';

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
  const { setErrors } = useContext(ErrorContext)
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
      setErrors(errors => [...errors, 'some error message here'])
    )

    const response = await getData()

    if (getHasFailed() || !response)
      return setErrors(errors => [
        ...errors,
        `get is name available request failed`,
      ])

    const {
      data: { error },
    } = response

    if (Object.keys(error).length) setIsNameAvailable(true)
    else {
      setErrors(errors => [...errors, error])
      setIsNameAvailable(false)
    }
  }

  const handleCheck = async (e: SyntheticEvent) => {
    e.preventDefault()
    await getIsNameAvailable(displayName)
  }

  const handleClick = async (e, type) => {
    e.preventDefault()

    if (isLoading) return

    setIsLoading(true)

    const { setCurrentUserContext } = updateCurrentUser({ id, type }, 'rate')

    params && params.name && (await setCurrentUserContext())
    setIsLoading(false)
  }

  const handleSubmit = async e => {
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
      setErrors(errors => [...errors, "You haven't change any of your data."])
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
    success && history.push('/profile')
  }

  if (isLoading) return <Loader />
  if (isEditing && !hasMatchedEdit) return <Redirect to="/edit" />

  const renderProfile = (
    <StyledProfile>
      <div className="avatar">
        <img className="image" src={avatar ?? ''} alt="avatar" />
      </div>
      <Header centered className="title">
        {displayName}
      </Header>
      <Base className="bio">{bio}</Base>
      {id !== user.id && (
        <Button
          as={Link}
          active={followed}
          className={`button`}
          to={`${followed ? 'un' : ''}follow`}
          onClick={e => handleClick(e, 'follow')}
        >
          {(followed ? 'Unf' : 'F') + 'ollow!'}
        </Button>
      )}
      <Button as={Link} className="button" to={`/posts/${displayName}`}>
        Posts
      </Button>
      {id !== user.id && (
        <Button as={Link} className="button" to={`/message/${id}`}>
          Send a message
        </Button>
      )}
      {id === user.id && (
        <Button
          as={Link}
          className="button"
          to={`/profile/edit`}
        >
          Edit profile
        </Button>
      )}
      {id !== user.id && (
        <ButtonError
          as={Link}
          active={blocked}
          className={`button`}
          to={`/${blocked ? 'un' : ''}block`}
          onClick={e => handleClick(e, 'block')}
        >
          {(blocked ? 'Unb' : 'B') + 'lock!'}
        </ButtonError>
      )}
      {id === user.id && (
        <ButtonError
          as={Link}
          onClick={logout}
          className={`button`}
          to="/logout"
        >
          Logout
        </ButtonError>
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