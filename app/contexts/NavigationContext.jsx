import React, { createContext, useState } from 'react';
import Proptypes from 'prop-types';

const NavigationContext = createContext({
  refresh: false,
  setRefresh: () => { }
});

const NavigationProvider = ({ children }) => {
  const [focused, setFocused] = useState();
  const [refresh, setRefresh] = useState(false);

  return (
    <NavigationContext.Provider value={{ focused, refresh, setFocused, setRefresh }}>
      {children}
    </NavigationContext.Provider>
  )
}

NavigationProvider.propTypes = {
  children: Proptypes.object
}

export { NavigationProvider, NavigationContext };
