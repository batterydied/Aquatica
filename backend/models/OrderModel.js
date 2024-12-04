// OrderModel
import { DataTypes } from "sequelize";
import sequelize from "../database.js";

// Define the Order model
const Order = sequelize.define("Order", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  price: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false }, 
});

// Define the class
class OrderModel {
  static async getModel() {
    // Ensure the database schema is synchronized
    await sequelize.sync({ force: true }); // Force sync drops existing tables
    console.log("Database schema recreated.");
    return Order;
  }

  // Method for getting all orders from the DB
  async getOrders() {
    return await Order.findAll();
  }

  // Method for adding an order to the DB
  async addCartItem(item) {
    return await Order.create(item);
  }
}

export default OrderModel;
