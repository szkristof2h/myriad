import mongoose from 'mongoose';

const { ObjectId, Schema } = mongoose;

const followedListSchema = new Schema({
  from: { type: ObjectId, index: true, required: true },
  to: { type: ObjectId, index: true, required: true }
});

const FollowedList = mongoose.model('FollowedList', followedListSchema);
export default FollowedList;
