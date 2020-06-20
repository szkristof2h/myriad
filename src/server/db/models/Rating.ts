import mongoose from "mongoose"
import { MongooseModel } from "./utils"

export interface RatingType extends MongooseModel {
  post: string
  value: number
  user: string
}

const { ObjectId, Schema } = mongoose

const ratingSchema = new Schema({
  post: ObjectId, // TODO: rename to idPost
  value: Number,
  user: ObjectId, // TODO: rename to idUser
})

const Rating = mongoose.model("Rating", ratingSchema)
export { Rating }
