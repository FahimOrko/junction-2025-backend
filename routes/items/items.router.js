import express from "express";
import { httpGetAllItems } from "./items.controller.js";

const itemsRouter = express.Router();

// -/api/v1/items
itemsRouter.get("/", httpGetAllItems);

export default itemsRouter;
