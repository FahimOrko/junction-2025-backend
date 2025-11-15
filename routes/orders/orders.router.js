// import {
//   httpAbortLaunch,
//   httpGetAllLaunches,
//   httpPostNewLaunch,
// } from "./launches.controller.js";
import express from "express";

const ordersRouter = express.Router();

// /api/v1/ - get all orders
ordersRouter.get("/", httpGetAllOrders);

// /api/v1/:orderID - get sigle order
ordersRouter.get("/:orderID", httpGetSingleOrder);

// /api/v1/:orderID/:itemID/issue - post a new issue
ordersRouter.post("/:orderID/:itemID/issue", httpPostNewIssue);

// /api/v1/:orderID/:itemID/issue - post a new item in order
ordersRouter.post("/:orderID", httpPostNewItem);

// /api/v1/:orderID/:itemID/issue - put a issue
ordersRouter.put("/:orderID/:itemID/issue", httpPutIssue);

// /api/v1/:orderID/:itemID - del a orderd item
ordersRouter.del("/:orderID/:itemID", httpDelItem);

export default ordersRouter;
