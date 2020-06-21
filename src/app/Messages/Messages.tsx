import React, { FC } from "react"
import Comments from "../Comments/Comments"
import { Box } from "../components/Box.style"
import { Header } from "../Typography/Typography.style"

interface Props {
  params: {
    conversationPartner: string
  }
}

const Message: FC<Props> = ({ params }) => {
  return (
    <Box>
      <Header centered size={2}>
        Conversation with {params.conversationPartner}
      </Header>
      <Comments type="messages" idParent={params.conversationPartner} />
    </Box>
  )
}

export default Message
