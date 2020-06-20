import mongoose from "mongoose"
import { sanitize } from "../../utils"
import { MongooseModel } from "./utils"

const { ObjectId, Schema } = mongoose

export interface CommentModel extends Comment, MongooseModel {}
export interface Comment {
  createdAt: Date
  idParent: string
  idUser: string
  text: string
  type: string
  updatedAt: Date
}

const commentSchema = new Schema({
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now, index: true },
  idParent: ObjectId,
  idUser: {
    type: ObjectId,
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
