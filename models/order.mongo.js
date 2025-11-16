import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  issues: {
    type: Object,
    default: null, // will hold issue object later
  },
});

const orderSchema = new mongoose.Schema({
  orderedItems: [orderItemSchema],
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "inprogress", "issues"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
