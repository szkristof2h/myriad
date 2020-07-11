import React, { useState } from "react"
import StyledConversations, { MessageContainer } from "./Conversations.style"
import { Header, Base } from "../Typography/Typography.style"
import useGetData from "../hooks/useGetData"
import Loader from "../Loader"
import { Link } from "react-router-dom"

export interface GetConversationsData {
  conversations: {
    conversationPartner: string
    createdAt: Date
    displayName: string
    id: string
    idUsers: string[]
    text: string
    updatedAt: Date
  }[]
}

const Conversations = () => {
  const [url, setUrl] = useState(`messages/0/20`)
  const { data, isLoading } = useGetData<GetConversationsData>(url)
  const conversations = data?.conversations

  // TODO: add load more button
  const handleLoadMore = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!isLoading) setUrl(`messages/${conversations?.length}/20`)
  }

  return (
    <StyledConversations>
      <Header size={2} centered>
        Inbox
      </Header>
      {isLoading ? (
        <Loader />
      ) : (
        conversations?.map(conversation => {
          return (
            <MessageContainer key={conversation.id}>
              <Base
                to={`message/${conversation.conversationPartner}`}
                as={Link}
              >
                {conversation?.text}
              </Base>
              <Base to={`user/${conversation.conversationPartner}`} as={Link}>
                {conversation?.conversationPartner}
              </Base>
              <Base style={{ ["&:hover"]: { textDecoration: "initial" } }}>
                {conversation?.updatedAt}
              </Base>
            </MessageContainer>
          )
        })
      )}
    </StyledConversations>
  )
}

export default Conversations
