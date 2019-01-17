import mongoose from 'mongoose';
import isURL from 'validator/lib/isURL';
import { sanitize } from '../../util/misc';

const { ObjectId, Schema} = mongoose;

const postSchema = new Schema({
  date: { type: Date, default: Date.now },
  description: {
    type: String,
    maxlength: [200, 'The description can\'t be longer than 200 characters!'],
    minlength: [3, 'The description should be at least 3 characters!'],
    required: [true, 'Your post should have a description!'],
    set: v => sanitize(v)
  },
  comments: Number,
  downs: { type: Number, index: true, default: 0 },
  link: {
    type: String,
    validate: {
      validator: v => isURL(v),
      message: props => `${props.value} is not a valid url!`
    },
    required: [true, 'You should give your post a link!']
  },
  image: {
    type: String,
    validate: {
      validator: v => isURL(v),
      message: props => `${props.value} is not a valid url!`
    },
    required: [true, 'You should give your post a thumbnail!']
  },
  postedById: ObjectId,
  postedByName: String,
  ratio: { type: Number, index: true },
  tags: { type: [String], index: true },
  title: {
    type: String,
    minLength: [3, 'Your title should be more than 3 characters long!'],
    maxlength: [50, 'Your title shouldn\'t be more than 50 characters long!'],
    required: [true, 'You didn\'t post a title!']
  },
  ups: { type: Number, index: true, default: 0 }
});

const Post = mongoose.model('Post', postSchema);
export default Post;
