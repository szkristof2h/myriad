import mongoose from "mongoose";

const { ObjectId, Schema } = mongoose;

const subscriptionSchema = new Schema({
  from: { type: ObjectId, index: true, required: true },
  to: { type: ObjectId, index: true, required: true }
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
