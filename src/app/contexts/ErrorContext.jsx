import React, { createContext, useState } from 'react';
import Proptypes from 'prop-types';

const ErrorContext = createContext({ errors: [], setErrors: () => {} });

const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  return (
    <ErrorContext.Provider value={{ errors, setErrors }}>
      {children}
    </ErrorContext.Provider>
  )
}

ErrorProvider.propTypes = {
  children: Proptypes.object
}

export { ErrorProvider, ErrorContext };
