import mongoose from "mongoose"
import { MongooseModel } from "./utils"

export interface FollowListModel extends FollowListType, MongooseModel {}
export interface FollowListType {
  idFollowing: string
  idUser: string
}

const { ObjectId, Schema } = mongoose
const followListSchema = new Schema({
  idFollowing: { type: ObjectId, index: true, required: true },
  idUser: { type: ObjectId, index: true, required: true },
})
const FollowList = mongoose.model("FollowList", followListSchema)

export default FollowList
