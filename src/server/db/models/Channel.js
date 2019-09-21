import mongoose from "mongoose";
import { sanitize } from "../../util/utils";

const { ObjectId, Schema } = mongoose;

const channelSchema = new Schema({
  date: { type: Date, default: Date.now },
  description: {
    type: String,
    maxlength: [300, "The description can't be longer than 300 characters!"],
    minlength: [3, "The description should be at least 3 characters!"],
    required: [true, "A channel should have a description!"],
    set: v => sanitize(v)
  },
  posts: Number,
  postedById: ObjectId,
  postedByName: String,
  tags: {
    type: [String],
    required: [true, "A channel should have at least 5 tags!"],
    validate: {
      validator: (tags) => {
        console.log("asd", tags.length);
        const filteredTags = [
          ...new Set(
            tags
              .map(tag => sanitize(tag))
              .filter(tag => tag && tag.length < 30 && tag.length > 2)
          )
        ];
        return filteredTags.length > 4 && filteredTags.length < 51;
      },
      message: ({ value: tags }) => {
        const filteredTags = [
          ...new Set(
            tags
              .map(tag => sanitize(tag))
              .filter(tag => tag && tag.length < 30 && tag.length > 2)
          )
        ];
        return filteredTags.length < 5
          ? "A channel should have at least 5 tags"
          : filteredTags.length > 50
            ? "A channel should not have more than 50 tags"
            : "";
      }
    },
    set: tags => tags.map(tag => sanitize(tag)),
    index: true
  },
  title: {
    type: String,
    minLength: [3, "Your title should be more than 3 characters long!"],
    maxlength: [50, "Your title shouldn't be more than 50 characters long!"],
    required: [true, "You didn't post a title!"]
  }
});

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
