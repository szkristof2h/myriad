import React from 'react';
import Loading from 'react-feather/dist/icons/loader';
import Popup from './Popup.jsx';
import './loader.css';

export default function Loader() {
  return (
  <Popup dismissible={false} modifier="loader" show={true}>
      <div className="loader posts__header">
        <Loading className="loader__icon" strokeWidth="1.5px" size="100" color="white" />
        <div className="loader__text">Loading...</div>
    </div>
  </Popup>
  );
}
