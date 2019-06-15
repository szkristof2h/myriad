import React from 'react';
import Proptypes from 'prop-types';
import Comments from '../Comments/Comments.jsx';
import { Box } from "../components/Box.style";
import { Header } from "../Typography/Typography.style";


export default function Message({ params }) {
  return (
    <Box>
      <Header centered size={2}>
        Conversation with {params.name}
      </Header>
      <Comments type="messages" id={params.name} />
    </Box>
  )
}

Message.propTypes = {
  params: Proptypes.object.isRequired
}

