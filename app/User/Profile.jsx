import React, { useContext, useEffect, useState } from 'react';
import Proptypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ErrorContext } from '../contexts/ErrorContext.jsx';
import { UserContext } from '../contexts/UserContext.jsx';
import config from '../config';
import Popup from '../Popup.jsx';
import Loader from '../Loader.jsx';
import './profile.css';

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

  const handleInput = (e, change) => change(e.currentTarget.value);

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

  const changeDisplayName = () => displayName === profile.displayName ? new Promise(res => res(false)) : axios
    .put(`${siteUrl}/put/user/displayName`, { displayName })

  return (
    !loading ?
      !edit ?
        <div className="profile box box--basic">
          <div className="profile__avatar">
            <img className="profile__image" src={profile.avatar ? profile.avatar : 'asd'} alt="avatar" />
          </div>
          <div className="profile__title">
            {profile.displayName}
          </div>
          <div className="profile__bio">
            {profile.bio}
          </div>
          {profile._id !== user._id && <Link className={`profile__button${profile.followed ? ' post__button--active' : ''} button`}
            to={`/post/user/${profile.followed ? 'un' : ''}follow`}
            onClick={e => handleClick(e)}>
            {(profile.followed ? 'Unf' : 'F') + 'ollow!'}
          </Link>}
          <Link className="profile__button button" to={`/posts/${profile.displayName}`}>
            Posts
            </Link>
          {profile._id !== user._id && <Link className="profile__button button" to={`/message/${params.name}`}>
            Send a message
            </Link >}
          {profile._id === user._id && <Link className="profile__button button" onClick={e => clickEdit(e)} to={`/profile/edit`}>
            Edit profile
            </Link >}
          {profile._id !== user._id && <Link className={`profile__button button button--warn${profile.blocked ? ' button--active' : ''}`}
            to={`/post/user/${profile.blocked ? 'un' : ''}block`}
            onClick={e => handleClick(e)}>
            {(profile.blocked ? 'Unb' : 'B') + 'lock!'}
          </Link>}
          {profile._id === user._id && <Link className={`profile__button button button--warn`}
            to="/logout">
            Logout
            </Link>}
        </div> :
        <Popup dismissible={profile.displayName ? true : false} dismiss={() => setEdit(false)} modifier="profile" show={true}>
          <div className="profile profile__edit box box--basic">
            <div className="submit__header">Edit your profile</div>
            <div className="submit__label">Display Name (can only set once)*</div>
            <input className="submit__input submit__input--text" onChange={e => handleInput(e, setDisplayName)} value={displayName} />
            <Link
              className={`submit__button button${available ? ' button--ok' :
                available !== null ? ' button--warn' : ''}`}
              onClick={e => handleCheck(e)}
              to="check/displayName">
              Check availability
            </Link>
            <div className="submit__label">Avatar</div>
            <img className="profile__avatar" src={avatar} />
            <input className="submit__input submit__input--text" onChange={e => handleInput(e, setAvatar)} value={avatar} />
            <div className="submit__label">Bio</div>
            <textarea className="submit__input submit__input--text" onChange={e => handleInput(e, setBio)} rows="1" value={bio} />
            <Link className="submit__button button" onClick={e => handleSubmit(e)} to="check/displayName">Save</Link>
          </div>
        </Popup>
      : <Loader />
  )
}

Profile.propTypes = {
  params: Proptypes.object.isRequired
}
