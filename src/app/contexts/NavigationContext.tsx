import React, { createContext, useState } from 'react';

interface Error {
  [type: string]: string[]
}

interface NavigationContextInterface {
  refresh: boolean
  isFocused: boolean
  setRefresh: (shouldRefresh: boolean) => void
  setIsFocused: (isFocused: boolean) => void
}


const initialState: NavigationContextInterface = {
  refresh: false,
  isFocused: false,
  setRefresh: shouldRefresh => {},
  setIsFocused: isFocused => {},
}

const NavigationContext = createContext<NavigationContextInterface>(initialState)

const NavigationProvider = ({ children }) => {
  const [isFocused, setIsFocused] = useState();
  const [refresh, setRefresh] = useState(false);

  return (
    <NavigationContext.Provider
      value={{ isFocused, refresh, setIsFocused, setRefresh }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export { NavigationProvider, NavigationContext };
