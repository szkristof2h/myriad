import React from 'react';
import Loading from 'react-feather/dist/icons/loader';
import StyledLoader from './Loader.style';
import { Header } from './Typography/Typography.style'

const Loader = () => {
  return (
    <StyledLoader
      dismissible={false}
      modifier="loader"
      show={true}
      type="basic"
    >
      <div className="loader">
        <Loading
          strokeWidth="1.5px"
          size="100"
          color="white"
        />
        <Header size={3} centered={1}>
          Loading...
        </Header>
      </div>
    </StyledLoader>
  )
}

export default Loader
