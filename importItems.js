// importItems.js
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// MongoDB connection string from .env
const MONGO_DB_URI = process.env.MONGO_DB_URI;

// Flexible schema for imported data
const itemSchema = new mongoose.Schema({}, { strict: false });
const Item = mongoose.model("Item", itemSchema, "items"); // explicitly match your collection name

// Path to your JSON file
const itemsFilePath = path.join(process.cwd(), "data", "items.json");

const importItems = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_DB_URI);
    console.log("✅ Connected to MongoDB");

    // Read JSON file
    const itemsData = JSON.parse(fs.readFileSync(itemsFilePath, "utf-8"));

    // Optional: clear existing collection
    await Item.deleteMany({});
    console.log("🗑 Cleared existing items");

    // Insert items
    await Item.insertMany(itemsData);
    console.log(`✅ Inserted ${itemsData.length} items`);

    // Disconnect
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error importing items:", err);
    process.exit(1);
  }
};

// Run the script
importItems();
