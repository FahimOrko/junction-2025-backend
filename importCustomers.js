import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Customer from "./models/customer.mongo.js";

dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_URI;

mongoose.connection.once("open", () => console.log("✅ Connected to MongoDB"));
mongoose.connection.on("error", (err) =>
  console.error("❌ MongoDB connection error:", err)
);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB_URI);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const importCustomers = async () => {
  try {
    const data = JSON.parse(fs.readFileSync("./data/customers.json", "utf-8"));

    // Optional: clear existing collection
    await Customer.deleteMany();
    console.log("🗑️ Cleared existing customers");

    const inserted = await Customer.insertMany(data);
    console.log(`✅ Imported ${inserted.length} customers`);
    process.exit();
  } catch (err) {
    console.error("❌ Error importing customers:", err);
    process.exit(1);
  }
};

connectDB().then(importCustomers);
