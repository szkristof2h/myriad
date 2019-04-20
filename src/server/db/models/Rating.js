import mongoose from 'mongoose';

const { ObjectId, Schema } = mongoose;

const ratingSchema = new Schema({
  post: ObjectId,
  value: Number,
  user: ObjectId
});

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
