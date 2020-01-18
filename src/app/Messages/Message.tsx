import React, { FC } from 'react';
import Comments from '../Comments/Comments';
import { Box } from "../components/Box.style";
import { Header } from "../Typography/Typography.style";

interface Props {
  params: {
    name: string
  }
}

const Message: FC<Props> = ({ params }) => {
  return (
    <Box>
      <Header centered size={2}>
        Conversation with {params.name}
      </Header>
      <Comments type="messages" idPost={params.name} />
    </Box>
  )
}


export default Message
