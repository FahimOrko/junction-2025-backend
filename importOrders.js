import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Order from "./models/order.mongo.js"; // make sure this file exists
import Customer from "./models/customer.mongo.js"; // to reference customer IDs
import Item from "./models/item.mongo.js"; // to reference item IDs

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

// Sample orders data
const ordersData = [
  {
    orderedItems: [
      {
        _id: "691909ee724ee2e071098943",
        name: "Valio Milk 2L",
        status: "available",
        price: 2.99,
        quantity: 50,
        issues: null,
      },
      {
        _id: "691909ee724ee2e071098944",
        name: "FreshFarm Milk 3L",
        status: "available",
        price: 3.49,
        quantity: 40,
        issues: null,
      },
      {
        _id: "691909ee724ee2e071098945",
        name: "NordLac Milk 1L",
        status: "available",
        price: 1.79,
        quantity: 60,
        issues: null,
      },
    ],
    customerId: "691912315f97fcefc0733006",
    status: "pending",
    createdAt: new Date("2025-11-10T10:15:00.000Z"),
  },
  {
    orderedItems: [
      {
        _id: "691909ee724ee2e071098948",
        name: "GoldenGrain Basmati Rice 5kg",
        status: "available",
        price: 12.99,
        quantity: 30,
        issues: null,
      },
      {
        _id: "691909ee724ee2e071098949",
        name: "DailyRice Long Grain 5kg",
        status: "available",
        price: 10.99,
        quantity: 35,
        issues: null,
      },
    ],
    customerId: "691912315f97fcefc0733007",
    status: "inprogress",
    createdAt: new Date("2025-11-12T14:30:00.000Z"),
  },
  {
    orderedItems: [
      {
        _id: "691909ee724ee2e07109894d",
        name: "SunnyValley Orange Juice 1L",
        status: "available",
        price: 2.19,
        quantity: 55,
        issues: null,
      },
      {
        _id: "691909ee724ee2e07109894e",
        name: "NordFresh Orange Juice 1.5L",
        status: "available",
        price: 2.79,
        quantity: 40,
        issues: null,
      },
      {
        _id: "691909ee724ee2e07109894f",
        name: "FreshPress Apple Juice 1L",
        status: "available",
        price: 1.99,
        quantity: 50,
        issues: null,
      },
    ],
    customerId: "691912315f97fcefc0733008",
    status: "issues",
    createdAt: new Date("2025-11-11T09:00:00.000Z"),
  },
  {
    orderedItems: [
      {
        _id: "691909ee724ee2e071098952",
        name: "BakeHouse White Bread 500g",
        status: "available",
        price: 1.49,
        quantity: 70,
        issues: null,
      },
      {
        _id: "691909ee724ee2e071098953",
        name: "GrainLoaf Whole Wheat Bread 600g",
        status: "available",
        price: 1.89,
        quantity: 60,
        issues: null,
      },
    ],
    customerId: "691912315f97fcefc0733009",
    status: "pending",
    createdAt: new Date("2025-11-13T16:45:00.000Z"),
  },
  {
    orderedItems: [
      {
        _id: "691909ee724ee2e071098957",
        name: "FreshEggs Farm Eggs 12pcs",
        status: "available",
        price: 3.49,
        quantity: 80,
        issues: null,
      },
      {
        _id: "691909ee724ee2e071098958",
        name: "HappyHen Organic Eggs 10pcs",
        status: "available",
        price: 4.29,
        quantity: 60,
        issues: null,
      },
      {
        _id: "691909ee724ee2e071098959",
        name: "DailyNest Brown Eggs 12pcs",
        status: "available",
        price: 3.79,
        quantity: 55,
        issues: null,
      },
    ],
    customerId: "691912315f97fcefc073300a",
    status: "inprogress",
    createdAt: new Date("2025-11-14T11:20:00.000Z"),
  },
];

const importOrders = async () => {
  try {
    // Optional: clear existing orders
    await Order.deleteMany();
    console.log("🗑️ Cleared existing orders");

    const inserted = await Order.insertMany(ordersData);
    console.log(`✅ Imported ${inserted.length} orders`);
    process.exit();
  } catch (err) {
    console.error("❌ Error importing orders:", err);
    process.exit(1);
  }
};

connectDB().then(importOrders);
