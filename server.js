import dotenv from "dotenv";
import app from "./app.js";
import http from "http";
import connectDB from "./services/mongo.js";
import Item from "./models/item.mongo.js";

// dotenv
dotenv.config();

// data from env
const PORT = process.env.PORT || 8000;

// create server instance with app from express
const server = http.createServer(app);

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // const items = await Item.find();
    // console.log(items);

    // Start your server or app logic here
    server.listen(PORT, () => {
      console.log(`🚀 Server listening on port - http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌", err);
    process.exit(1); // Exit with failure
  }
};

startServer();
