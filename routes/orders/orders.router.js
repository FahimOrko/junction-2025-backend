// // import {
// //   httpAbortLaunch,
// //   httpGetAllLaunches,
// //   httpPostNewLaunch,
// // } from "./launches.controller.js";
// import express from "express";

// const ordersRouter = express.Router();

// export default ordersRouter;

import express from "express";
import {
  httpDelItem,
  httpGetAllOrders,
  httpGetSingleOrder,
  httpPostNewIssue,
  httpPostNewItem,
  httpPutIssue,
} from "./orders.controller.js";

const ordersRouter = express.Router();

// -/api/v1/orders
ordersRouter.get("/", httpGetAllOrders);

// /api/v1/orders/:orderID - get sigle order
ordersRouter.get("/:orderID", httpGetSingleOrder);

// /api/v1/orders/:orderID/:itemID/issue - post a new issue
ordersRouter.post("/:orderID/:itemID/issue", httpPostNewIssue);

// // /api/v1/orders/:orderID/addNewItem- post a new issue
ordersRouter.post("/:orderID/addNewItem", httpPostNewItem);

// /api/v1/orders/:orderID/:itemID/issue - put a issue
ordersRouter.put("/:orderID/:itemID/issue", httpPutIssue);

// /api/v1/orders/:orderID/:itemID - del a orderd item
ordersRouter.delete("/:orderID/:itemID", httpDelItem);

export default ordersRouter;
