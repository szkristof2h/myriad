import React, { useContext, useEffect, useState } from 'react';
import Proptypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ErrorContext } from '../contexts/ErrorContext.jsx';
import { UserContext } from '../contexts/UserContext.jsx';
import config from '../config';
import Loader from '../Loader.jsx';
import { Header, Base } from "../Typography/Typography.style";
import StyledProfile from "./Profile.style"
import { Button, ButtonError } from "../components/Button.style";
import EditProfile from "./EditProfile.jsx";

const siteUrl = config.url;

export default function Profile({ params }) {
  const { user, setUser } = useContext(UserContext);
  const { setErrors } = useContext(ErrorContext);
  const [available, setAvailable] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (params && params.name)
      axios
        .get(`${siteUrl}/get/user/${params.name}`)
        .then(res => {
          if (res.data.errors) setErrors(errors => [...errors, res.data]);
          else setProfile({ ...res.data, logged: true });
        })
        .catch(e => setErrors(errors => [...errors, e.response.data]));
    else {
      setProfile(user);
      user.avatar && setAvatar(user.avatar);
      user.bio && setBio(user.bio);
      if (user.displayName) {
        setDisplayName(user.displayName);
        setEdit(false);
      }
    }
  }, [user]);

  useEffect(() => { setAvailable(null) }, [displayName]);
  useEffect(() => {
    if (profile.firstName) {
      !profile.displayName && setEdit(true);
      setLoading(false)
    }
  }, [profile]);

  const clickEdit = e => {
    e.preventDefault();
    setEdit(true);
  }

  const handleCheck = e => {
    e.preventDefault();
    axios
      .get(`${siteUrl}/get/user/displayName/${displayName}`)
      .then(r => {
        if (r.data.errors) setAvailable(false);
        else setAvailable(true);
      })
      .catch(e => setErrors(errors => [...errors, e.response.data]));
  }

  const handleClick = e => {
    e.preventDefault();

    params && params.name ? axios
      .post(`${e.currentTarget.href}`, { targetUser: profile._id })
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else setProfile(profile => ({ ...profile, [res.data.type]: !profile[res.data.type] }))
      })
      .catch(e => setErrors(errors => [...errors, e.response.data])) : '';
  }

  const handleLogout = () => setUser({});

  const handleSubmit = e => {
    e.preventDefault();

    let success = true;
    changeDisplayName(displayName)
      .then(r => {
        if (r && r.data.errors) setErrors(errors => [...errors, r.data]);
        else if (r) {
          setProfile(profile => ({ ...profile, displayName }));
          setUser(user => ({ ...user, displayName }));
        }

        return avatar || bio ? axios.put(`${siteUrl}/put/user/profile`, { avatar, bio }) : false;
      })
      .then(r => {
        if (!r) return;
        if (r.data.errors) { setErrors(errors => [...errors, r.data]); success = false; }
        setProfile(profile => ({ ...profile, avatar, bio }));
      })
      .then(() => success && setEdit(false))
      .catch(e => setErrors(errors => [...errors, e.response.data]));
  }

  const changeDisplayName = () =>
    displayName === profile.displayName
      ? new Promise(res => res(false))
      : axios.put(`${siteUrl}/put/user/displayName`, { displayName });

  return !loading ? (
    !edit ? (
      <StyledProfile>
        <div className="avatar">
          <img
            className="image"
            src={profile.avatar ? profile.avatar : ""}
            alt="avatar"
          />
        </div>
        <Header centered className="title">{profile.displayName}</Header>
        <Base className="bio">{profile.bio}</Base>
        {profile._id !== user._id && (
          <Button
            as={Link}
            active={profile.followed}
            className={`button`}
            to={`/post/user/${profile.followed ? "un" : ""}follow`}
            onClick={e => handleClick(e)}
          >
            {(profile.followed ? "Unf" : "F") + "ollow!"}
          </Button>
        )}
        <Button
          as={Link}
          className="button"
          to={`/posts/${profile.displayName}`}
        >
          Posts
        </Button>
        {profile._id !== user._id && (
          <Button as={Link} className="button" to={`/message/${params.name}`}>
            Send a message
          </Button>
        )}
        {profile._id === user._id && (
          <Button
            as={Link}
            className="button"
            onClick={e => clickEdit(e)}
            to={`/profile/edit`}
          >
            Edit profile
          </Button>
        )}
        {profile._id !== user._id && (
          <ButtonError
            as={Link}
            active={profile.blocked}
            className={`button`}
            to={`/post/user/${profile.blocked ? "un" : ""}block`}
            onClick={e => handleClick(e)}
          >
            {(profile.blocked ? "Unb" : "B") + "lock!"}
          </ButtonError>
        )}
        {profile._id === user._id && (
          <ButtonError as={Link} onClick={handleLogout} className={`button`} to="/logout">
            Logout
          </ButtonError>
        )}
      </StyledProfile>
    ) : (
      <EditProfile
        available={available}
        avatar={avatar}
        bio={bio}
        displayName={displayName}
        handleCheck={handleCheck}
        handleSubmit={handleSubmit}
        setAvatarsetAvatar
        setBio={setBio}
        setDisplayName={setDisplayName}
      />
    )
  ) : (
    <Loader />
  );
}

Profile.propTypes = {
  params: Proptypes.object.isRequired
}
