import express from "express";
import cors from "cors";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
// we can also set the version here, and inside api were importing the routes
// so instaed api we can go like - /api/v1

// app.use("/api/v1", api);

app.get("/", (req, res) => {
  res.send("hello world");
});

export default app;
