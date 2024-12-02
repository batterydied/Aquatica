import { DataTypes } from "sequelize";
import sequelize from "../database.js";

// Define the Cart model
const Cart = sequelize.define("Cart", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  isSaved: { type: DataTypes.BOOLEAN, defaultValue: false },
  price: { type: DataTypes.FLOAT, allowNull: false }, // New field
  description: { type: DataTypes.STRING, allowNull: false }, // New field
});

class CartModel {
  static async getModel() {
    // Ensure the database schema is synchronized
    await sequelize.sync({ force: true }); // Force sync drops existing tables
    console.log("Database schema recreated.");
    return Cart;
  }

  async getCartItems() {
    return await Cart.findAll({ where: { isSaved: false } });
  }

  async getSavedItems() {
    return await Cart.findAll({ where: { isSaved: true } });
  }

  async addCartItem(item) {
    return await Cart.create(item);
  }

  async removeCartItem(itemId) {
    return await Cart.destroy({ where: { id: itemId } });
  }

  async saveForLater(itemId) {
    const item = await Cart.findByPk(itemId);
    if (item) {
      item.isSaved = true;
      await item.save();
      return item;
    }
    throw new Error(`Item with ID ${itemId} not found.`);
  }

  async moveToCart(itemId) {
    const item = await Cart.findByPk(itemId);
    if (item) {
      item.isSaved = false;
      await item.save();
      return item;
    }
    throw new Error(`Item with ID ${itemId} not found.`);
  }
}

export default CartModel;

