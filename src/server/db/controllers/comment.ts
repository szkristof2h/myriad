import { Request, Response, NextFunction } from "express"
import { setErrorType, setResponseData } from "../../utils"
import {
  GET_COMMENTS_ERROR,
  POST_COMMENT_ERROR,
  GET_CONVERSATIONS_ERROR,
} from "../types"
import BlockedList from "../models/BlockedList"
import Comment, { CommentModel } from "../models/Comment"
import User from "../models/User"
import Post from "../models/Post"
import Conversation, { ConversationModel } from "../models/Conversation"
import { GetConversationsData } from "src/app/Messages/Conversations"
import { GetCommentsData, PostCommentData } from "src/app/Comments/Comments"

const getComments = async (req: Request, res: Response) => {
  setErrorType(res, "GET_COMMENTS")
  const { idParent, skip = 0 } = req.params

  const comments: CommentModel[] = await Comment.find({ idParent })
    .sort("-date")
    .limit(20)
    .skip(Number(skip))
    .lean()
    .exec()
  const userNames: { _id: string; displayName: string }[] = await User.find()
    .where("_id")
    .in(comments.map(comment => comment.idUser))
    .select("displayName")
    .lean()
    .exec()
  const commentsWithUserNames = comments.map(comment => {
    const { _id, _v, ...commentWithout_id } = comment

    return {
      ...commentWithout_id,
      id: _id,
      displayName:
        userNames.find(
          userName =>
            userName._id.toString() === commentWithout_id.idUser.toString()
        )?.displayName ?? "",
    }
  })

  const responseData: GetCommentsData = { comments: commentsWithUserNames }

  setResponseData(res, responseData)
}

const getConversations = async (req: Request, res: Response) => {
  const { skip = 0 } = req.params
  const idUser = req.user?.id

  setErrorType(res, "GET_CONVERSATIONS_ERROR")

  const limit = 20
  const conversations: ConversationModel[] = await Conversation.where("idUsers")
    .in([idUser])
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(Number(skip))
    .lean()
    .exec()
  const messages: CommentModel[] = await Comment.where("idParent")
    .in(conversations.map(conversation => conversation._id))
    .sort({ updatedAt: -1 })
    .limit(1)
    .select("idParent text idUser")
    .lean()
    .exec()
  const userNames: { _id: string; displayName: string }[] = await User.where(
    "_id"
  )
    .in([
      ...new Set(conversations.flatMap(conversation => conversation.idUsers)),
    ])
    .select("displayName")
    .lean()
    .exec()
  const messagessWithUserNames = messages.map(message => ({
    ...message,
    userName: userNames.find(userName => userName._id === message.idUser)
      ?.displayName,
  }))
  const conversationsWithMessages = conversations.map(conversation => {
    const { _id, _v, ...conversationWithout_id } = conversation
    const message = messagessWithUserNames.find(
      message => message.idParent.toString() === _id.toString()
    )
    const conversationPartner =
      userNames.find(userName =>
        conversation.idUsers
          .map(id => id.toString())
          .filter(id => id !== idUser)
          .includes(userName._id.toString())
      )?.displayName ?? ""

    return {
      ...conversationWithout_id,
      conversationPartner,
      id: _id,
      displayName: message?.userName ?? "",
      text: message?.text ?? "",
    }
  })

  const responseData: GetConversationsData = {
    conversations: conversationsWithMessages,
  }

  setResponseData(res, responseData)
}

const getMessages = async (req: Request, res: Response) => {
  const idUser = req.user?.id
  const displayName = req.user?.displayName ?? ""
  const { id: conversationPartnerName } = req.params
  const skip = Number(req.params.skip) ?? 0

  setErrorType(res, "GET_MESSAGES_ERROR")

  const conversationPartner: {
    _id: string
  }[] = await User.where({ displayName: conversationPartnerName })
    .select("_id")
    .lean()
    .exec()

  if (!conversationPartner?.length) throw Error("CONVERSATION_NOT_FOUND")

  const conversation: ConversationModel[] = await Conversation.where("idUsers")
    .all([conversationPartner[0]._id, idUser])
    .lean()
    .exec()

  if (!conversation?.length) throw Error("CONVERSATION_NOT_FOUND")

  const messages: CommentModel[] = await Comment.where({
    idParent: conversation[0]._id,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(20)
    .lean()
    .exec()
  const messagesWithUsers = messages.map(message => {
    const { _id, _v, ...messageWithout_id } = message

    return {
      conversationPartner: conversationPartner[0]._id,
      id: _id,
      ...messageWithout_id,
      displayName:
        messageWithout_id.idUser.toString() === idUser
          ? displayName
          : conversationPartnerName,
    }
  })

  const responseData: GetCommentsData = { comments: messagesWithUsers }

  setResponseData(res, responseData)
}

const postComment = async (req: Request, res: Response) => {
  const idUser = req.user?.id
  const idParent = req.body.idParent
  const text = req.body.text

  setErrorType(res, "GET_MESSAGES_ERROR")

  const newComment = new Comment({
    idParent,
    idUser,
    text,
    type: "comment",
  })

  newComment.save()

  await Post.findOneAndUpdate({ _id: idParent }, { $inc: { comments: 1 } })
    .select("_id")
    .lean()
    .exec()

  const responseData: PostCommentData = { status: "success" }

  setResponseData(res, responseData)
}

const postMessage = async (req: Request, res: Response, next: NextFunction) => {
  const idUser = req.user?.id
  const targetName = req.body.idParent
  const text = req.body.text

  setErrorType(res, "GET_MESSAGES_ERROR")

  const targetUser: { _id: string }[] = await User.find({
    displayName: targetName,
  })
    .select("_id")
    .lean()
    .exec()

  if (targetUser.length === 0) throw Error("USER_NOT_FOUND")

  const isUserBlocked = await BlockedList.find({
    idUser: targetUser[0]._id,
    idBlocked: idUser,
  }).exec()

  if (isUserBlocked.length !== 0) {
    const responseData: PostCommentData = { status: "failed" }
    setResponseData(res, responseData)
    return next()
  }

  const conversations: ConversationModel[] = await Conversation.where("idUsers")
    .all([targetUser[0]._id, idUser])
    .lean()
    .exec()
  let idConversation // TODO: make it work without let

  if (!conversations.length) {
    const newConversation = new Conversation({
      idUsers: [targetUser[0]._id, idUser],
    }).save()

    idConversation = newConversation._id
  } else {
    await Conversation.findByIdAndUpdate(conversations[0]._id, {
      updatedAt: Date.now(),
    })

    idConversation = conversations[0]._id
  }

  const newMessage = new Comment({
    idParent: idConversation,
    idUser,
    text,
    type: "message",
  })

  newMessage.save()

  const responseData: PostCommentData = { status: "success" }
  setResponseData(res, responseData)
}

export { getComments, getConversations, getMessages, postComment, postMessage }
