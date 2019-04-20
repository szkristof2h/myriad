import mongoose from 'mongoose';

const { ObjectId, Schema } = mongoose;

const blockedListSchema = new Schema({
  by: { type: ObjectId, index: true, required: true },
  user: { type: ObjectId, index: true, required: true }
});

const BlockedList = mongoose.model('BlockedList', blockedListSchema);
export default BlockedList;
