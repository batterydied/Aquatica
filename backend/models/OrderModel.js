/*
  OrderModel: Devin
  Description: This file defines the schema and methods for managing orders in the database.
  Issue: #56
  Owner: Devin
  Expected Outcome: An order model that effectively tracks orders, including product details,
                    quantity, and user information.

Interface with database.sqlite to manage fetching and storing order data in the database.
  - Method: Init(): Sync the database schema.
  - Method: getOrders(): Fetch all orders matching a userId, with optional filters.
  - Method: addOrder(): Adds a new order to the database with details from productModel.
  - Method: addOrderManually(): Adds a new order to the database manually, for testing purposes.
*/

// Imports
import { DataTypes } from "sequelize";
import sequelize from "../database.js";
// import { Product } from "./ProductModel.js"; // Uncomment when ProductModel is implemented

// Define the Order model
const Order = sequelize.define("Order", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.UUID, allowNull: false },
  // Uncomment when ProductModel is implemented
  /*
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Products", // Matches Product table name
      key: "prodid", // Foreign key in Product table
    },
  },
  */
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  userId: { type: DataTypes.UUID, allowNull: false }, // User who placed the order
  price: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

// Define relationships
// Uncomment when ProductModel is implemented
/*
Order.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Order, { foreignKey: "productId" });
*/

// OrderModel Class
class OrderModel {
  /**
   * Initialize the database schema for Orders.
   */
  static async init() {
    await sequelize.sync({ force: true });
    console.log("Order table synced successfully.");
  }

  /**
   * Fetch all orders for a user, optionally filtered by additional criteria.
   * @param {string} userId - The ID of the user whose orders are being fetched.
   * @returns {Promise<Array>} - List of orders.
   */
  static async getOrders(userId) {
    return await Order.findAll({
      where: { userId },
      attributes: ["id", "productId", "price", "description", "quantity", "userId"],
      // Uncomment when ProductModel is implemented
      /*
      include: [
        {
          model: Product,
          attributes: ["prodid", "price", "description"], // Include product details
        },
      ],
      */
    });
  }

  /**
   * Add a new order to the database.
   * @param {string} productId - The product's ID.
   * @param {number} quantity - Quantity of the product.
   * @param {string} userId - The ID of the user placing the order.
   * @returns {Promise<Object>} - The created order item.
   */
  static async addOrder(productId, quantity, userId) {
    // Uncomment when ProductModel is implemented
    /*
    const product = await Product.findByPk(productId, {
      attributes: ["price", "description"],
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found.`);
    }
    */

    return await Order.create({
      productId,
      quantity,
      userId,
      // Uncomment when ProductModel is implemented
      // price: product.price,
      // description: product.description,
    });
  }

  /**
   * For testing: Add an order manually without Product reference.
   * @param {string} productId - The product's ID.
   * @param {number} price - Price of the product.
   * @param {string} description - Description of the product.
   * @param {number} quantity - Quantity of the product.
   * @param {string} userId - The ID of the user placing the order.
   * @returns {Promise<Object>} - The created order item.
   */
  static async addOrderManually(productId, price, description, quantity, userId) {
    return await Order.create({
      productId,
      price,
      description,
      quantity,
      userId,
    });
  }
}

export default OrderModel;
export { Order };
