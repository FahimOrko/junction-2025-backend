import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  usualOrderedItems: { type: [String], default: [] }, // array of item names
  location: { type: String, required: true },
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
