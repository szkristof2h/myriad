import React from 'react';
import Popup from '../Popup.jsx';
import Google from '../images/Google.jsx';
import { ButtonGoogle } from "../components/Button.style";
import { Box } from "../components/Box.style";
import { Header } from "../Typography/Typography.style";

export default function Login() {
  return (
    <Popup show={true} dismissible={false}>
      <Box style={{ zIndex: 100 }}>
        <Header centered size={3}>
          Login
        </Header>
        <ButtonGoogle
          as={"a"}
          href="/auth/google"
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
        </ButtonGoogle>
      </Box>
    </Popup>
  );
}
