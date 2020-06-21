import mongoose from "mongoose"
import { MongooseModel } from "./utils"

export interface RatingType extends MongooseModel {
  idPost: string
  idUser: string
  value: number
}

const { ObjectId, Schema } = mongoose

const ratingSchema = new Schema({
  idPost: ObjectId,
  idUser: ObjectId,
  value: Number,
})

const Rating = mongoose.model("Rating", ratingSchema)
export { Rating }
