import mongoose from "mongoose";
import Order from "../../models/order.mongo.js";
import Item from "../../models/item.mongo.js";

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

export const httpPutIssue = async (req, res) => {
  try {
    const { orderID, itemID } = req.params;

    const {
      customerAction,
      replacementItemId, // optional, only valid when customerAction === "replace"
    } = req.body;

    // Basic validation
    if (!customerAction) {
      return res.status(400).json({
        message: "customerAction field is required",
      });
    }

    if (!["replace", "remove"].includes(customerAction)) {
      return res.status(400).json({
        message: "customerAction must be either 'replace' or 'remove'",
      });
    }

    // Fetch order
    const order = await Order.findById(orderID);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Target item
    const item = order.orderedItems.id(itemID);
    if (!item) {
      return res.status(404).json({ message: "Item not found in the order" });
    }

    if (!item.issues) {
      return res.status(400).json({
        message: "This item does not have an issue to update",
      });
    }

    // -------------------------------
    // AUTO-RESOLVE LOGIC
    // -------------------------------
    if (customerAction === "replace") {
      // replacement requires replacementItemId
      if (!replacementItemId) {
        return res.status(400).json({
          message:
            "replacementItemId is required when customerAction = replace",
        });
      }

      item.issues.resolved = true; // ← automatic
      item.issues.customerAction = "replace";
      item.issues.replacementItemId = new mongoose.Types.ObjectId(
        replacementItemId
      );
    }

    if (customerAction === "remove") {
      item.issues.resolved = true; // or false? depends on your rule — you said nothing explicit
      item.issues.customerAction = "remove";
      item.issues.replacementItemId = null;
    }

    // Save order
    await order.save();

    res.status(200).json({
      message: "Issue updated successfully",
      item,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating issue",
      error: err.message,
    });
  }
};

export const httpDelItem = async (req, res) => {
  try {
    const { orderID, itemID } = req.params;

    // Find order
    const order = await Order.findById(orderID);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find item
    const item = order.orderedItems.id(itemID);
    if (!item) {
      return res.status(404).json({ message: "Item not found in this order" });
    }

    // Remove item
    item.deleteOne(); // this removes the subdocument from the array

    // Save updated order
    await order.save();

    res.status(200).json({
      message: "Item removed successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error removing item",
      error: err.message,
    });
  }
};

export const httpPostNewItem = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { replacementItemId } = req.body;

    if (!replacementItemId) {
      return res.status(400).json({ message: "replacementItemId is required" });
    }

    // Fetch order
    const order = await Order.findById(orderID);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Fetch item by ID
    const itemToAdd = await Item.findById(replacementItemId);
    if (!itemToAdd)
      return res.status(404).json({ message: "Replacement item not found" });

    // Prepare new order item object
    const newItem = {
      _id: new mongoose.Types.ObjectId(),
      name: itemToAdd.name,
      status: itemToAdd.status,
      price: itemToAdd.price,
      quantity: 1, // default 1 for replacement
      issues: null,
    };

    // Add new item to order
    order.orderedItems.push(newItem);
    await order.save();

    res
      .status(201)
      .json({ message: "Replacement item added successfully", item: newItem });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding replacement item", error: err.message });
  }
};
