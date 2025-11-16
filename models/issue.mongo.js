import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Out of Stock", "Damaged", "Expired", "Other"],
    required: true,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  deliveryMessage: {
    type: String,
    default: "",
  },
  customerAction: {
    type: String,
    enum: ["replace", "remove"],
    required: true,
  },
  replacementItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
