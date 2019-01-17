import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ErrorContext } from './contexts/ErrorContext.jsx';
import config from './config';
import './tags.css';

const siteUrl = config.url;

export default function Tags() {
  const [tags, setTags] = useState([]);
  const { setErrors } = useContext(ErrorContext);

  useEffect(() => {
    axios
      .get(`${siteUrl}/get/tags`)
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else setTags(res.data);
      })
      .catch(e => setErrors(errors => [...errors, e.response.data]));
  }, []);

  return (
    <ul className="tags">
      {tags.map(t => <li key={`tag:${t}`} className="tag">
        <Link className="tag__link" to={`/tag/${t}`}>#{t.trim()}</Link>
      </li>)}
    </ul>
  );
}
