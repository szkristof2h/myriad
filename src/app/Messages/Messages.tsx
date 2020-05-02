import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ErrorContext } from "../contexts/ErrorContext"
import { UserContext } from "../contexts/UserContext"
import StyledMessages from "./Messages.style"
import { Header, Base } from "../Typography/Typography.style"
import { APIRequestInteface, get } from "../utils/api"
import { CommentData } from "../Comments/Comments"

interface GetMessagesInterface extends APIRequestInteface<GetMessagesData> {}
export interface GetMessagesData {
  ids: string[]
  messages: CommentData[]
}

const Messages = () => {
  const [messages, setMessages] = useState<CommentData[]>([])
  const [ids, setIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useContext(UserContext)
  const { addError } = useContext(ErrorContext)

  const getMessages = () => {
    setIsLoading(true)
    const { getData, cancel, getHasFailed }: GetMessagesInterface = get<
      GetMessagesData
    >(`messages/${ids.length}/20`, () =>
      addError({ conversations: ["some error message here"] })
    )

    const setAllMessages = async () => {
      const response = await getData()

      if (getHasFailed() || !response)
        return addError({ conversations: [`get messages request failed`] })

      const {
        data: { error, ids: newIds, messages: newMessages },
      } = response

      if (error) return addError(error.message, error.type)

      setMessages({ ...messages, ...newMessages })
      setIds([...ids, ...newIds])
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
    <StyledMessages>
      <Header size={2} centered>
        Inbox
      </Header>
      {ids &&
        ids.map((id) => {
          const message = messages.find((m) => m.id === id)
          return (
            <div className="message" key={id}>
              <Base
                as={Link}
                to={`message/${message?.postedByName.filter(
                  (name) => name != user.displayName
                )}`}
                className="text"
              >
                {message?.text}
              </Base>
              <Base
                as={Link}
                to={`user/${message?.postedByName.filter(
                  (name) => name != user.displayName
                )}`}
                className="user"
              >
                {message?.postedByName.filter(
                  (name) => name !== user.displayName
                )}
              </Base>
              <Base className="date">
                {message?.date && (message.date + "").slice(0, 10)}
              </Base>
            </div>
          )
        })}
    </StyledMessages>
  )
}

export default Messages
