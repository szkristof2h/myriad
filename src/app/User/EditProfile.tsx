import React, { FC, SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import StyledEditProfile from './EditProfile.style'
import { Input, TextArea } from '../components/Input.style'
import { Button, ButtonError, ButtonOk } from '../components/Button.style'
import { Header } from '../Typography/Typography.style'

interface Props {
  handleCheck: (e: SyntheticEvent) => Promise<void>
  handleSubmit: (e: SyntheticEvent) => Promise<void>
  isNameAvailable: boolean | null
  newProfile: {
    avatar: string
    bio: string
    displayName: string
  }
  setNewProfile: (newProfile: {
    avatar: string
    bio: string
    displayName: string
  }) => void
}

const EditProfile: FC<Props> = ({
  handleCheck,
  handleSubmit,
  newProfile,
  isNameAvailable,
  setNewProfile,
}) => {
  const handleInput = (
    value: { [key in 'avatar' | 'bio' | 'displayName']: string }
  ) => setNewProfile({ ...newProfile, ...value })
  const { avatar, bio, displayName } = newProfile
  const CheckButton = isNameAvailable
    ? ButtonOk
    : isNameAvailable !== null
    ? ButtonError
    : Button

  return (
    <StyledEditProfile>
      <Header centered size={2} className="header">
        Edit your profile
      </Header>
      <Header centered size={1}>
        Display Name (can only set once)*
      </Header>
      <Input
        onChange={
          (e: SyntheticEvent) =>
            handleInput({ displayName: e.currentTarget.value }) // TODO: fix ts error
        }
        value={displayName}
      />
      <CheckButton
        as={Link}
        onClick={async (e: SyntheticEvent) => await handleCheck(e)}
        to="check/displayName"
      >
        {isNameAvailable
          ? 'Available'
          : isNameAvailable === false
          ? 'Already in use'
          : 'Check availability'}
      </CheckButton>
      <Header centered>Avatar</Header>
      <img className="avatar" src={avatar} />
      <Input
        onChange={(e: SyntheticEvent) =>
          handleInput({ avatar: e.currentTarget.value })
        }
        value={avatar}
      />
      <Header centered size={1}>
        Bio
      </Header>
      <TextArea
        onChange={(e: SyntheticEvent) =>
          handleInput({ bio: e.currentTarget.value })
        }
        rows="1"
        value={bio}
      />
      <Button
        as={Link}
        onClick={async (e: SyntheticEvent) => await handleSubmit(e)}
        to="check/displayName"
      >
        Save
      </Button>
    </StyledEditProfile>
  )
}

export default EditProfile
