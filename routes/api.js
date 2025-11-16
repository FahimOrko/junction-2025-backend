import express from "express";
import itemsRouter from "./items/items.router.js";
import customersRouter from "./customers/customers.router.js";
import ordersRouter from "./orders/orders.router.js";

const api = express.Router();

api.use("/items", itemsRouter);
api.use("/customers", customersRouter);
api.use("/orders", ordersRouter);

export default api;
