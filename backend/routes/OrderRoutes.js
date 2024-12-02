// OrderRoutes

import express from "express";
import OrderController from "../controllers/OrderController.js";

class OrderRoutes {
  constructor() {
    this.router = express.Router(); // Properly initialize the router
    this.initializeRoutes();
  }

initializeRoutes() {
    // Order endpoints
  
    // Get all orders
    this.router.get("/", (req, res) => {
        console.log("GET /api/order called.");
        CartController.getOrders(req, res);
    });

    // Make a new order
    this.router.post("/", (req, res) => {
        console.log("POST /api/order called.");
        OrderController.addOrder(req, res);
    });  
}

  getRouter() {
    return this.router; // Return the router instance
  }
}

export default new OrderRoutes().getRouter();
