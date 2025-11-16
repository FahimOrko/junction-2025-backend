import mongoose from "mongoose";
import Order from "../../models/order.mongo.js";

export const httpGetAllOrders = async (req, res) => {
  try {
    // Fetch all orders and populate related items and customer info
    const orders = await Order.find()
      .populate("orderedItems") // fetch full item details
      .populate("customerId"); // fetch full customer details

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const httpGetSingleOrder = async (req, res) => {
  try {
    const { orderID } = req.params;

    const order = await Order.findById(orderID).populate("customerId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};

export const httpPostNewIssue = async (req, res) => {
  try {
    const { orderID, itemID } = req.params;
    const {
      type,
      resolved,
      deliveryMessage,
      customerAction,
      replacementItemId,
    } = req.body;

    // Validate required fields
    if (
      !type ||
      resolved === undefined ||
      !deliveryMessage ||
      !customerAction
    ) {
      return res.status(400).json({ message: "All issue fields are required" });
    }

    // Validate type and customerAction values
    if (!["Out of Stock", "Damaged", "Expired", "Other"].includes(type)) {
      return res.status(400).json({ message: "Invalid issue type" });
    }
    if (!["replace", "remove"].includes(customerAction)) {
      return res.status(400).json({
        message: "customerAction must be either 'replace' or 'remove'",
      });
    }

    // Fetch order
    const order = await Order.findById(orderID);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Find the item
    const item = order.orderedItems.id(itemID);
    if (!item)
      return res.status(404).json({ message: "Item not found in order" });

    // Update issues field
    item.issues = {
      type,
      resolved,
      deliveryMessage,
      customerAction,
      replacementItemId: replacementItemId
        ? new mongoose.Types.ObjectId(replacementItemId)
        : null,
      createdAt: new Date(),
    };

    await order.save();

    res.status(200).json({ message: "Issue added successfully", item });
  } catch (err) {
    res.status(500).json({ message: "Error adding issue", error: err.message });
  }
};
