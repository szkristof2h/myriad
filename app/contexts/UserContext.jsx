import React, { createContext, useEffect, useState } from 'react';
import Proptypes from 'prop-types';
import axios from 'axios';
import config from '../config';


const siteUrl = config.url;
const UserContext = createContext({ user: {}, setUser: () => {} });

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get(`${siteUrl}/get/user`)
      .then(res => {
        if (res.data.errors) console.log('ERROR');
        else setUser({ ...res.data, logged: true });
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: Proptypes.array
}

export { UserProvider, UserContext };
