import mongoose from 'mongoose';

const { ObjectId, Schema } = mongoose;

const conversationSchema = new Schema({
  by: ObjectId,
  user: ObjectId
});

const Conversation = mongoose.model('BlockedList', conversationSchema);
export default Conversation;
