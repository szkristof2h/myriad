import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ErrorContext } from '../contexts/ErrorContext.jsx';
import { UserContext } from '../contexts/UserContext.jsx';
import config from '../config';
import StyledMessages from "./Messages.style"
import { Header, Base } from "../Typography/Typography.style";

const siteUrl = config.url;

export default function Messages() {
  const [messages, setMessages] = useState({});
  const [ids, setIds] = useState([]);
  const { user } = useContext(UserContext);
  const { setErrors } = useContext(ErrorContext);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const getMessages = () => {
    axios
      .get(`${siteUrl}/get/messages/${ids.length}/20`, { cancelToken: source.token })
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else {
          setMessages({ ...messages, ...res.data.conversations });
          setIds([...ids, ...res.data.ids]);
        }
      })
      .catch(e => !axios.isCancel(e) && setErrors(errors => [...errors, e.response.data]))
  };

  useEffect(() => {
    getMessages();
    return () => {
      source.cancel();// cancel axios request
    }
  }, []);

  return (
    <StyledMessages>
      <Header size={2} centered>
        Inbox
      </Header>
      {ids &&
        ids.map(id => (
          <div className="message" key={id}>
            <Base
              as={Link}
              to={`message/${messages[id].postedByName.filter(
                n => n != user.displayName
              )}`}
              className="text"
            >
              {messages[id].text}
            </Base>
            <Base
              as={Link}
              to={`user/${messages[id].postedByName.filter(
                n => n != user.displayName
              )}`}
              className="user"
            >
              {messages[id].postedByName.filter(n => n !== user.displayName)}
            </Base>
            <Base className="date">
              {messages[id].date && (messages[id].date + "").slice(0, 10)}
            </Base>
          </div>
        ))}
    </StyledMessages>
  );
}
