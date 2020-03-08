import React from 'react';
import Popup from '../Popup';
import Google from '../images/Google.jsx';
import { Button } from "../components";
import { Box } from "../components/Box.style";
import { Header } from "../Typography/Typography.style";

const Login = () => {
  return (
    <Popup show={true} dismissible={false}>
      <Box style={{ zIndex: 100 }}>
        <Header centered size={3}>
          Login
        </Header>
        <Button
          as={"a"}
          href="/auth/google"
          type="google"
          style={{ display: "grid", gridAutoFlow: "column" }}
        >
          <Google
            size="40"
            fill="white"
            strokeWidth="0"
            alt="login with google"
          />
          <Header centered size={2} style={{ fontWeight: 600 }}>
            Login with Google
          </Header>
        </Button>
      </Box>
    </Popup>
  );
}

export default Login
