import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ErrorContext } from "../contexts/ErrorContext"
import StyledConversations, { MessageContainer } from "./Conversations.style"
import { Header, Base } from "../Typography/Typography.style"
import { APIRequestInteface, get } from "../utils/api"

interface GetMessagesInterface
  extends APIRequestInteface<GetConversationsData> {}
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
  const [conversations, setConversations] = useState<
    GetConversationsData["conversations"]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const { addError } = useContext(ErrorContext)

  const getMessages = () => {
    setIsLoading(true)
    const { getData, cancel, getHasFailed }: GetMessagesInterface = get<
      GetConversationsData
    >(`messages/${conversations.length}/20`, () =>
      addError({ conversations: ["some error message here"] })
    )

    const setAllMessages = async () => {
      const response = await getData()

      if (getHasFailed() || !response)
        return addError({ conversations: [`get messages request failed`] })

      const {
        data: { error, conversations: newConversations },
      } = response

      if (error) return addError(error.message, error.type)

      setConversations([...conversations, ...newConversations])
    }

    setIsLoading(false)
    return { cancel, setAllMessages }
  }

  useEffect(() => {
    if (!isLoading) {
      const { cancel, setAllMessages } = getMessages()
      ;(async () => await setAllMessages())()

      return cancel
    }
  }, [])

  return (
    <StyledConversations>
      <Header size={2} centered>
        Inbox
      </Header>
      {conversations.map(conversation => {
        return (
          <MessageContainer key={conversation.id}>
            <Base as={Link} to={`message/${conversation.conversationPartner}`}>
              {conversation?.text}
            </Base>
            <Base as={Link} to={`user/${conversation.conversationPartner}`}>
              {conversation?.conversationPartner}
            </Base>
            <Base style={{ ["&:hover"]: { textDecoration: "initial" } }}>
              {conversation?.updatedAt}
            </Base>
          </MessageContainer>
        )
      })}
    </StyledConversations>
  )
}

export default Conversations
