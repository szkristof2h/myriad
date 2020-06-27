import React, { FC, useState, useContext, useEffect } from "react"
import { Link, Redirect } from "react-router-dom"
import StyledEditProfile from "./EditProfile.style"
import { Button, Input, TextArea } from "../components"
import { Header } from "../Typography/Typography.style"
import useGetData from "../hooks/useGetData"
import { UserContext } from "../contexts/UserContext"
import Loader from "../Loader"
import usePostData from "../hooks/usePostData"

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

  // TODO: add some kind of throttling
  const { data, isLoading } = useGetData<IsNameAvailableData>(
    !!newDisplayName ? `user/displayName/${newDisplayName}` : ""
  )
  const { isLoading: isLoadingUpdate, startPost } = usePostData<
    IsNameAvailableData,
    UpdateProfileVariables
  >(`user/profile`, newProfile)

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
  const checkButtonType = !displayName
    ? "primary"
    : !isNameAvailable
    ? "danger"
    : "confirm"

  const handleInput = (value: inputFieldTypes) => {
    if (!isLoading) setNewProfile({ ...newProfile, ...value })
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()

    await startPost()

    setNewProfile({ avatar: "", bio: "", displayName: "" })
    refetch()
  }

  if (isLoadingCurrentUser) return <Loader /> // integrate loading into box
  if (!currentUser) return <Redirect to="/login" />

  return (
    <StyledEditProfile>
      <Header centered size={2} className="header">
        Edit your profile
      </Header>
      <Header centered size={1}>
        Display Name (can only be set once)*
      </Header>
      <Input
        onChange={e =>
          handleInput({ displayName: e.currentTarget.value ?? "" })
        }
        value={newDisplayName}
        disabled={!!displayName}
      />
      <Header centered>Avatar</Header>
      <img className="avatar" src={newAvatar} />
      <Input
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
        as={Link}
        type="primary"
        onClick={async e => await handleSubmit(e)}
        to="profile/update"
      >
        Save
      </Button>
    </StyledEditProfile>
  )
}

export default EditProfile
