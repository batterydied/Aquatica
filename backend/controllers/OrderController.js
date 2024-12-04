/*
  OrderController: Devin
  Description: This file serves as the controller for managing order-related
               operations, interfacing between the model and the API endpoints.
  Issue: #54
  Owner: Devin
  Expected Outcome: A controller that seamlessly handles order-related API requests
                    such as fetching and adding orders.

  Interface with the OrderModel to manage data flow between the frontend and database.

  - Method: getOrders(): Fetch all orders for a user.
  - Method: addOrder(): Add a new order to the database.
*/

// Imports
import OrderModel from "../models/OrderModel.js";

class OrderController {
  constructor() {
    this.initializeModel();
  }

  /**
   * Initialize the OrderModel.
   */
  async initializeModel() {
    try {
      this.model = await OrderModel.init();
      console.log("OrderController: Model initialized successfully.");
    } catch (error) {
      console.error("OrderController: Failed to initialize model.", error);
    }
  }

  /**
   * Fetch all orders for the signed-in user.
   * @param {Object} req - Express request object containing userId in `req.user`.
   * @param {Object} res - Express response object.
   */
  async getOrders(req, res) {
    try {
      console.log("OrderController: getOrders called.");
      const userId = req.user?.id || "test-user-id"; // Default userId for testing

      // Fetch orders for the user
      const orders = await OrderModel.getOrders(userId);

      res.json({ orders });
    } catch (error) {
      console.error("Error in getOrders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  /**
   * Add a new order to the database.
   * @param {Object} req - Express request object containing order data.
   * @param {Object} res - Express response object.
   */
  async addOrder(req, res) {
    try {
      console.log("OrderController: addOrder called.");
      const userId = req.user?.id || "test-user-id"; // Default userId for testing

      // Data from the request body
      const { productId, quantity, price, description } = req.body;

      // Use manual addition for testing without ProductModel
      const newOrder = await OrderModel.addOrderManually(
        productId,
        price,
        description,
        quantity,
        userId
      );

      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error in addOrder:", error);
      res.status(500).json({ error: "Failed to add order." });
    }
  }
}

export default new OrderController();
