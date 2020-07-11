import mongoose from "mongoose"
import { MongooseModel } from "./utils"

const { ObjectId, Schema } = mongoose

export interface BlockedListModel extends BlockedListType, MongooseModel {}
export interface BlockedListType {
  idTarget: string
  idUser: string
}

const blockedListSchema = new Schema({
  idTarget: { type: ObjectId, index: true, required: true },
  idUser: { type: ObjectId, index: true, required: true },
})

const BlockedList = mongoose.model("BlockedList", blockedListSchema)
export default BlockedList
