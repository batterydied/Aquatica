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
  - Method: cancelOrder(): Cancel (remove) an existing order.
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
      const userId = req.user?.id || "test-user-id";
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
      const userId = req.user?.id || "test-user-id";
      const { orders } = req.body; // array of { productId, price, description, quantity }

      if (!orders || !Array.isArray(orders) || orders.length === 0) {
        return res.status(400).json({ error: "Invalid or missing order data." });
      }

      const orderPromises = orders.map(({ productId, price, description, quantity }) => {
        return OrderModel.addOrderManually(productId, price, description, quantity, userId);
      });

      const newOrders = await Promise.all(orderPromises);
      res.status(201).json(newOrders);
    } catch (error) {
      console.error("Error in addOrder:", error);
      res.status(500).json({ error: "Failed to add order." });
    }
  }

    /**
   * Cancel (delete) an existing order.
   * @param {Object} req - Express request object containing orderId in `req.params.id`.
   * @param {Object} res - Express response object.
   */
  async cancelOrder(req, res) {
    try {
      const userId = req.user?.id || "test-user-id";
      const { id } = req.params;

      const result = await OrderModel.cancelOrder(id, userId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in cancelOrder:", error);
      res.status(500).json({ error: "Failed to cancel order." });
    }
  }
}

export default new OrderController();
