import mongoose from 'mongoose';
import { sanitize } from '../../util/misc';

const { ObjectId, Schema} = mongoose;

const commentSchema = new Schema({
  date: { type: Date, default: Date.now, index: true },
  text: {
    type: String,
    maxlength: [200, 'Your comment can\'t be longer than 200 characters!'],
    minlength: [2, 'Your comment should be at least 3 characters!'],
    required: [true, 'Your comment should have a description!'],
    set: v => sanitize(v)
  },
  postedOn: ObjectId,
  poster: ObjectId,
  postedById: { type: [ObjectId], index: true, required: [true, 'Invalid poster or target user!'] },
  postedByName: { type: [String], index: true, required: [true, 'Invalid poster or target user!'] }
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
