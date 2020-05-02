import mongoose from "mongoose"
import { sanitize } from "../../utils"

export interface UserModel {
  _id: string
  avatar: string
  bio: string
  displayName: string
  googleId: string
  firstName: string
  id: string
  lastName: string
}

const { Schema } = mongoose

const userSchema = new Schema({
  avatar: String,
  firstName: String,
  displayName: { type: String, index: true },
  lastName: String,
  bio: {
    type: String,
    maxlength: [200, "The description can't be longer than 200 characters!"],
    minlength: [3, "The description should be at least 3 characters!"],
    set: (value: string) => sanitize(value),
  },
  googleId: String,
  social: {
    facebook: String,
    google: String,
    twitter: String,
  },
})

const User = mongoose.model("User", userSchema)
export default User
