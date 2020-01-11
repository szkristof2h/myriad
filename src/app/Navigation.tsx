import React, { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import Home from 'react-feather/dist/icons/home';
import Add from 'react-feather/dist/icons/plus';
import Login from 'react-feather/dist/icons/log-in';
import Message from 'react-feather/dist/icons/message-circle';
import Profile from 'react-feather/dist/icons/user';
import Refresh from 'react-feather/dist/icons/refresh-cw';
import Updates from 'react-feather/dist/icons/bell';
import { NavigationContext } from './contexts/NavigationContext.jsx';
import { UserContext } from './contexts/UserContext.jsx';
import StyledNavigation from './Navigation.style';
import { Base } from "./Typography/Typography.style";

const Navigation:FC = () => {
  const { setRefresh } = useContext(NavigationContext);
  const { user } = useContext(UserContext);

  const handleRefresh = e => {
    e.preventDefault();
    setRefresh(true);
  }

  return (
    <StyledNavigation className="navigation">
      <Link className="button" to="/">
        <Home className="icon" strokeWidth="1.5px" color="black" />
        <Base>Home</Base>
      </Link>
      <Link className="button" to={`${user.logged ? '/add' : '/login'}`}>
        <Add className="icon" strokeWidth="1.5px" color="black" />
        <Base>Add new!</Base>
      </Link>
      <Link className="button" to={`${user.logged ? '/profile' : '/login'}`}>
        {user.logged ? (
          <Profile className="icon" strokeWidth="1.5px" color="black" />
        ) : (
          <Login className="icon" strokeWidth="1.5px" color="black" />
        )}
        <Base>{user.logged ? 'Profile' : 'Login'}</Base>
      </Link>
      <Link className="button" to={`${user.logged ? '/messages' : '/login'}`}>
        <Message className="icon" strokeWidth="1.5px" color="black" />
        <Base>Messages</Base>
      </Link>
      <Link
        className="button"
        to={`${user.logged ? '/notifications' : '/login'}`}
      >
        <Updates className="icon" strokeWidth="1.5px" color="black" />
        <Base>Updates</Base>
      </Link>
      <Link className="button" to="/refresh" onClick={e => handleRefresh(e)}>
        <Refresh className="icon" strokeWidth="1.5px" color="black" />
        <Base>Refresh</Base>
      </Link>
    </StyledNavigation>
  )
}

export default Navigation