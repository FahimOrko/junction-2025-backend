import express from "express";
import { httpGetAllCustomers } from "./customers.controllers.js";

const customersRouter = express.Router();

// - /api/v1/customers
customersRouter.get("/", httpGetAllCustomers);

export default customersRouter;
