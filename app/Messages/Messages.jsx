import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ErrorContext } from '../contexts/ErrorContext.jsx';
import { UserContext } from '../contexts/UserContext.jsx';
import config from '../config';
import './messages.css';

const siteUrl = config.url;

export default function Messages() {
  const [messages, setMessages] = useState({});
  const [ids, setIds] = useState([]);
  const { user } = useContext(UserContext);
  const { setErrors } = useContext(ErrorContext);

  const getMessages = () => {
    axios
      .get(`${siteUrl}/get/messages/${ids.length}/20`)
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else {
          setMessages({ ...messages, ...res.data.conversations });
          setIds([...ids, ...res.data.ids]);
        }
      })
      .catch(e => setErrors(errors => [...errors, e.response.data]))
  };

  useEffect(() => {getMessages()}, []);

  return (
    <div className="messages box box--basic">
      <div className="message__header">
        Inbox
      </div>
      {ids && ids.map(id => (
        <div className="message" key={id}>
          <Link to={`message/${messages[id].postedByName.filter(n => n != user.displayName)}`} className="message__text">
            {messages[id].text}
          </Link>
          <Link to={`user/${messages[id].postedByName.filter(n => n != user.displayName)}`} className="message__user">
            {messages[id].postedByName.filter(n => n !== user.displayName)}
          </Link>
          <div className="message__date">
            {messages[id].date && (messages[id].date + "").slice(0, 10)}
          </div>
        </div>
      ))}
    </div>
  )
}
