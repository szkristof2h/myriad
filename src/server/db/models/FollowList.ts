import mongoose from "mongoose"
import { MongooseModel } from "./utils"

export interface FollowListModel extends FollowListType, MongooseModel {}
export interface FollowListType {
  idTarget: string
  idUser: string
}

const { ObjectId, Schema } = mongoose
const followListSchema = new Schema({
  idTarget: { type: ObjectId, index: true, required: true },
  idUser: { type: ObjectId, index: true, required: true },
})
const FollowList = mongoose.model("FollowList", followListSchema)

export default FollowList
