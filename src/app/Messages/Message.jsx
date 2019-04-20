import React from 'react';
import Proptypes from 'prop-types';
import Comments from '../Comments/Comments.jsx';
import './message.css';


export default function Message({ params }) {
  return (
    <div className="message box box--basic">
      <div className="message__header">
        Conversation with {params.name}
      </div>
      <Comments type="messages" id={params.name} />
    </div>
  )
}

Message.propTypes = {
  params: Proptypes.object.isRequired
}

