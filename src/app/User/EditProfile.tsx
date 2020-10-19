import React, { FC, useState, useContext, useEffect } from "react"
import { Redirect } from "react-router-dom"
import isURL from "validator/lib/isURL"
import * as Styled from "./EditProfile.style"
import { Button, Input, TextArea } from "../components"
import { Header } from "../Typography/Typography.style"
import useGetData from "../hooks/useGetData"
import { UserContext } from "../contexts/UserContext"
import Loader from "../Loader"
import usePostData from "../hooks/usePostData"
import { ErrorContext } from "../contexts/ErrorContext"

export interface UpdateProfileData {
  isUpdateSuccessful: boolean
}

export interface UpdateProfileVariables {
  avatar?: string
  bio?: string
  displayName?: string
}

export interface IsNameAvailableData {
  isNameAvailable: boolean
}

type inputFieldTypes = {
  avatar?: string
  bio?: string
  displayName?: string
}

const EditProfile: FC = () => {
  const { currentUser, isLoading: isLoadingCurrentUser, refetch } = useContext(
    UserContext
  )
  const { addError } = useContext(ErrorContext)
  const [newProfile, setNewProfile] = useState({
    avatar: "",
    bio: "",
    displayName: "",
  })
  const displayName = currentUser?.displayName
  const {
    avatar: newAvatar,
    bio: newBio,
    displayName: newDisplayName,
  } = newProfile
  const [isNameCheckBlocked, setIsNameCheckBlocked] = useState(false)
  const { data, isLoading } = useGetData<IsNameAvailableData>(
    !!newDisplayName && !isNameCheckBlocked
      ? `user/displayName/${newDisplayName}`
      : ""
  )
  const {
    isLoading: isLoadingUpdate,
    startPost: startPostRequest,
  } = usePostData<IsNameAvailableData, UpdateProfileVariables>(`user/profile`)

  useEffect(() => {
    if (currentUser && !newAvatar && !newBio && !newDisplayName)
      // init form values
      setNewProfile({
        avatar: currentUser.avatar,
        bio: currentUser.bio,
        displayName: currentUser.displayName,
      })
  }, [currentUser])

  const isNameAvailable = data?.isNameAvailable
  const isAvatarValid = !newAvatar || isURL(newAvatar)
  const hasError =
    (!displayName && !newDisplayName) || !isNameAvailable || !isAvatarValid
  const handleInput = (value: inputFieldTypes) => {
    if (!isLoading) setNewProfile({ ...newProfile, ...value })
  }
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!displayName && !newDisplayName)
      addError("You should first set a displayname", "editProfile")
    else {
      await startPostRequest(newProfile)

      // redirect?
      setNewProfile({ avatar: "", bio: "", displayName: "" })
      refetch()
    }
  }

  if (isLoadingCurrentUser) return <Loader /> // integrate loading into box
  if (!currentUser) return <Redirect to="/login" />

  return (
    <Styled.EditProfile>
      <Header centered size={2} className="header">
        Edit your profile
      </Header>
      <Header centered size={1}>
        Display Name (can only be set once)*
      </Header>
      <Input
        hasError={!displayName && !!newDisplayName && isNameAvailable === false}
        message={"Name is unavailable."}
        onBlur={() => setIsNameCheckBlocked(false)}
        onChange={e => {
          setIsNameCheckBlocked(true)
          handleInput({ displayName: e.currentTarget.value ?? "" })
        }}
        value={newDisplayName}
        disabled={!!displayName}
      />
      <Header centered>Avatar</Header>
      {isAvatarValid && newAvatar && <img className="avatar" src={newAvatar} />}
      <Input
        hasError={!isAvatarValid}
        message={"Your avatar isn't a valid url."}
        onChange={e => handleInput({ avatar: e.currentTarget.value })}
        value={newAvatar}
      />
      <Header centered size={1}>
        Bio
      </Header>
      <TextArea
        onChange={e => handleInput({ bio: e.currentTarget.value })}
        rows="1"
        value={newBio}
      />
      <Button
        type="primary"
        isDisabled={hasError}
        isLoading={isLoadingUpdate}
        onClick={async e => await handleSubmit(e)}
        to="profile/update"
      >
        Save
      </Button>
    </Styled.EditProfile>
  )
}

export default EditProfile
