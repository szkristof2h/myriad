import mongoose from "mongoose"
import { MongooseModel } from "./utils"

const { ObjectId, Schema } = mongoose

export interface ConversationModel extends ConversationType, MongooseModel {}

export interface ConversationType {
  createdAt: Date
  updatedAt: Date
  idUsers: string[]
}

const conversationSchema = new Schema({
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now, index: true },
  idUsers: {
    type: [ObjectId],
    index: true,
    required: [true, "Invalid user!"],
  },
})

const Conversation = mongoose.model("Conversation", conversationSchema)
export default Conversation
