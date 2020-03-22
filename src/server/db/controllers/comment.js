import mongoose from "mongoose"
import { handleErrors, toObject } from "../../utils"
import {
  GET_COMMENTS_ERROR,
  POST_COMMENT_ERROR,
  GET_CONVERSATIONS_ERROR,
} from "../types"
import BlockedList from "../models/BlockedList"
import Comment from "../models/Comment"
import User from "../models/User"
import Post from "../models/Post"

export function getComments(req, res) {
  // gets comments for a post
  const { postedOn, skip = 0 } = req.params

  Comment.find({ postedOn })
    .sort("-date")
    .limit(20)
    .skip(Number(skip))
    .exec()
    .then(comments =>
      res.json({
        comments: { ...toObject(comments, "_id") },
        ids: comments.map(p => p._id),
      })
    )
    .catch(e => res.json(handleErrors(GET_COMMENTS_ERROR, e)))
}

export function getConversations(req, res) {
  // Gets user's all (20) conversations
  const { skip = 0 } = req.params
  const userId = mongoose.Types.ObjectId(res.locals.user.id)
  const limit = 20

  Comment.aggregate()
    .match({ postedById: { $in: [userId] }, type: "message" })
    .sort({ date: -1 })
    .group({
      _id: "$postedById",
      messages: {
        $push: {
          _id: "$_id",
          date: "$date",
          postedById: "$postedById",
          postedByName: "$postedByName",
          text: "$text",
        },
      },
    })
    .project({ messages: { $slice: ["$messages", 1] } })
    .sort({ "messages.date": -1 })
    .limit(limit)
    .skip(Number(skip))
    .exec()
    .then(messages => {
      return res.json({
        conversations: {
          ...toObject(
            messages.map(m => m.messages[0]),
            "_id"
          ),
        },
        ids: messages.map(m => m.messages[0]._id),
      })
    })
    .catch(e => res.json(handleErrors(GET_CONVERSATIONS_ERROR, e)))
}

export function getMessages(req, res) {
  // Gets messages from a single conversation
  const { from, skip = 0 } = req.params
  const userId = res.locals.user.id

  User.findOne({ displayName: from })
    .exec()
    .then(u =>
      !u
        ? Promise.reject({
            errors: { userId: { message: `Couldn't find the user: ${from}` } },
          })
        : Comment.find()
            .all("postedById", [u._id, userId])
            .sort("-date")
            .limit(20)
            .skip(Number(skip))
            .exec()
            .then(messages =>
              res.json({
                comments: { ...toObject(messages, "_id") },
                ids: messages.map(p => p._id),
              })
            )
    )
    .catch(e => res.json(handleErrors(GET_COMMENTS_ERROR, e)))
}

export function postComment(req, res) {
  const { postedOn, text } = req.body
  const { displayName } = res.locals.user
  const userId = res.locals.user.id
  const newComment = new Comment({
    text,
    poster: userId,
    postedById: [userId],
    postedByName: [displayName],
    postedOn,
    type: "comment",
  })

  Post.findOneAndUpdate({ _id: postedOn }, { $inc: { comments: 1 } })
    .select("_id")
    .exec()
    .then(p =>
      !p
        ? Promise.reject({
            errors: { postId: { message: "Post wasn't found!" } },
          })
        : newComment.save()
    )
    .then(c => res.json({ comments: { [c._id]: c }, ids: c._id }))
    .catch(e => res.json(handleErrors(POST_COMMENT_ERROR, e)))
}

export function postMessage(req, res) {
  const { postedByName, text } = req.body
  const { displayName } = res.locals.user
  const userId = res.locals.user.id
  const newComment = new Comment({ text, poster: userId, type: "message" })

  User.findOne({ displayName: postedByName })
    .exec()
    .then(u =>
      !u
        ? Promise.reject({ errors: { user: { message: "User not found!" } } })
        : BlockedList.findOne({ by: u._id, user: userId })
            .exec()
            .then(r => {
              if (r)
                return Promise.reject({
                  errors: { user: { message: "You are blocked by user!" } },
                })
              newComment.postedById = [userId, u._id].sort()
              newComment.postedByName = newComment.postedById.map(id =>
                id + "" === userId + "" ? displayName : u.displayName
              )
              return newComment.save()
            })
    )
    .then(c => res.json({ comments: { [c._id]: c }, ids: c._id }))
    .catch(e => res.json(handleErrors(POST_COMMENT_ERROR, e)))
}
