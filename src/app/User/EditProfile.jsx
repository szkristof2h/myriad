import React from "react";
import Proptypes from "prop-types";
import { Link } from "react-router-dom";
import StyledEditProfile from "./EditProfile.style";
import { Input, TextArea } from "../components/Input.style";
import { Button, ButtonError, ButtonOk } from "../components/Button.style";
import { Header } from "../Typography/Typography.style";

export default function EditProfile({
  available,
  avatar,
  bio,
  displayName,
  handleCheck,
  handleSubmit,
  setAvatar,
  setBio,
  setDisplayName
}) {
  const handleInput = (e, change) => change(e.currentTarget.value);
  const CheckButton = available ? ButtonOk : available !== null ? ButtonError : Button;

  return (
    <StyledEditProfile>
      <Header centered size={2} className="header">
        Edit your profile
      </Header>
      <Header centered size={1}>
        Display Name (can only set once)*
      </Header>
      <Input
        onChange={e => handleInput(e, setDisplayName)}
        value={displayName}
      />
      <CheckButton
        as={Link}
        onClick={e => handleCheck(e)}
        to="check/displayName"
      >
        {available
          ? "Available"
          : available === false
          ? "Already in use"
          : "Check availability"}
      </CheckButton>
      <Header centered>Avatar</Header>
      <img className="avatar" src={avatar} />
      <Input onChange={e => handleInput(e, setAvatar)} value={avatar} />
      <Header centered size={1}>
        Bio
      </Header>
      <TextArea onChange={e => handleInput(e, setBio)} rows="1" value={bio} />
      <Button as={Link} onClick={e => handleSubmit(e)} to="check/displayName">
        Save
      </Button>
    </StyledEditProfile>
  );
}

EditProfile.propTypes = {
  available: Proptypes.bool,
  avatar: Proptypes.string.isRequired,
  bio: Proptypes.string.isRequired,
  displayName: Proptypes.string.isRequired,
  handleCheck: Proptypes.func.isRequired,
  handleSubmit: Proptypes.func.isRequired,
  setAvailable: Proptypes.func,
  setAvatar: Proptypes.func,
  setBio: Proptypes.func.isRequired,
  setDisplayName: Proptypes.func.isRequired
};
