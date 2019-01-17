import React from 'react';
import Popup from '../Popup.jsx';
import Google from '../images/Google.jsx';
import './login.css';

export default function Login() {
  return (
    <Popup show={true} dismissible={false} >
      <div className="login box box--basic box--login">
        <h2 className="login__header">Login</h2>
        <a href="/auth/google" className="login__button button button--google">
          <Google size="40" fill="white"  strokeWidth="0" alt="login with google" />
          <h2 className="button__title">Login with Google</h2>
        </a>
      </div>
    </Popup>
  );
}
