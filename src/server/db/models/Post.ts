import mongoose from "mongoose"
import isURL from "validator/lib/isURL"
import { sanitize } from "../../utils"
import { MongooseModel } from "./utils"

const { ObjectId, Schema } = mongoose

export interface PostModel extends PostType, MongooseModel {}
export interface PostType {
  createdAt: Date
  description: string
  comments: number
  downs: number
  link: string
  idUser: string
  images: string[]
  postedByName: string
  ratio: number
  tags: string[]
  title: string
  ups: number
}

const postSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  description: {
    type: String,
    maxlength: [300, "The description can't be longer than 300 characters!"],
    minlength: [3, "The description should be at least 3 characters!"],
    required: [true, "Your post should have a description!"],
    set: (value: string) => sanitize(value),
  },
  comments: Number,
  downs: { type: Number, index: true, default: 0 },
  link: {
    type: String,
    validate: {
      validator: (value: string) => isURL(value),
      message: props => `${props.value} is not a valid url!`,
    },
    required: [true, "You should give your post a link!"],
  },
  idUser: ObjectId,
  images: {
    type: [String],
    validate: {
      validator: images => images.filter(image => !isURL(image)).length === 0,
      message: props =>
        `The following images aren't valid: ${props.value
          .filter(image => !isURL(image))
          .join(", ")}!`,
    },
    required: [true, "You should give your post a thumbnail!"],
  },
  postedByName: String,
  ratio: { type: Number, index: true },
  tags: { type: [String], index: true },
  title: {
    type: String,
    minLength: [3, "Your title should be more than 3 characters long!"],
    maxlength: [50, "Your title shouldn't be more than 50 characters long!"],
    required: [true, "You didn't post a title!"],
  },
  ups: { type: Number, index: true, default: 0 },
})

const Post = mongoose.model("Post", postSchema)
export default Post
