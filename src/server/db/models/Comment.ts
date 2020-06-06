import mongoose from "mongoose"
import { sanitize } from "../../utils"

const { ObjectId, Schema } = mongoose

export interface CommentModel {
  _id: string
  createdAt: Date
  idPost: string
  idReceiver: string
  idUser: string
  id: string
  text: string
  type: string
}

const commentSchema = new Schema({
  createdAt: { type: Date, default: Date.now, index: true },
  idPost: ObjectId,
  idReceiver: ObjectId,
  idUser: {
    type: [ObjectId],
    index: true,
    required: [true, "Invalid user!"],
  },
  text: {
    type: String,
    maxlength: [200, "Your comment can't be longer than 200 characters!"],
    minlength: [2, "Your comment should be at least 3 characters!"],
    required: [true, "Your comment should have a description!"],
    set: (text: string) => sanitize(text),
  },
  type: String,
})

const Comment = mongoose.model("Comment", commentSchema)
export default Comment
