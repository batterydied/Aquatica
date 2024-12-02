// OrderController
import OrderModel from "../models/OrderModel.js";

class OrderController {
  constructor() {
    this.initializeModel();
  }

  async initializeModel() {
    try {
      this.model = await OrderModel.getModel();
      console.log("OrderController: Model initialized successfully.");
    } catch (error) {
      console.error("OrderController: Failed to initialize model.", error);
    }
  }

async getOrders(req, res) {
    try {
        console.log("OrderController: getOrders called.");
        if (!this.model) {
            throw new Error("OrderController: Model is not initialized.");
        }
        const orders = await this.model.findAll({
            attributes: ['id', 'productId', 'quantity', 'price', 'description'], // Include these fields
        });
        res.json({ orders });
    } catch (error) {
        console.error("Error in getOrders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
}



  async addOrder(req, res) {
    try {
      console.log("OrderController: addOrder called.");
      if (!this.model) {
        throw new Error("OrderController: Model is not initialized.");
      }
      const order = req.body;
      const newOrder = await this.model.create(order);
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error in addOrder:", error);
      res.status(500).json({ error: "Failed to add order." });
    }
  }
}



export default new OrderController();
