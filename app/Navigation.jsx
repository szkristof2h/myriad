import React, { useContext } from 'react';
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
import './navigation.css';

export default function Navigation() {
  const { setRefresh } = useContext(NavigationContext);
  const { user } = useContext(UserContext);

  const handleRefresh = e => {
    e.preventDefault();
    setRefresh(true);
  }

  return (
    <nav className="navigation">
      <Link className="navigation__button" to="/">
        <Home className="navigation__icon" strokeWidth="1.5px" color="black" />
        <div className="navigation__text">Home</div>
      </Link>
      <Link className="navigation__button"
        to={`${user.logged ? '/add' : '/login'}`}>
        <Add className="navigation__icon" strokeWidth="1.5px" color="black" />
        <div className="navigation__text">Add new!</div>
      </Link>
      <Link className="navigation__button"
        to={`${user.logged ? '/profile' : '/login'}`}>
        {user.logged ? <Profile className="navigation__icon" strokeWidth="1.5px" color="black" />
          : <Login className="navigation__icon" strokeWidth="1.5px" color="black" />
        }
        <div className="navigation__text">{user.logged ? 'Profile' : 'Login'}</div>
      </Link>
      <Link className="navigation__button"
        to={`${user.logged ? '/messages' : '/login'}`}>
        <Message className="navigation__icon" strokeWidth="1.5px" color="black" />
        <div className="navigation__text">Messages</div>
      </Link>
      <Link className="navigation__button"
        to={`${user.logged ? '/notifications' : '/login'}`}>
        <Updates className="navigation__icon" strokeWidth="1.5px" color="black" />
        <div className="navigation__text">Updates</div>
      </Link>
      <Link className="navigation__button" to="/refresh" onClick={e => handleRefresh(e)}>
        <Refresh className="navigation__icon" strokeWidth="1.5px" color="black" />
        <div className="navigation__text">Refresh</div>
      </Link>
    </nav>
  );
}
