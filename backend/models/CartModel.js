import { DataTypes } from "sequelize";
import sequelize from "../database.js";

// Define the Cart model
const Cart = sequelize.define("Cart", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  isSaved: { type: DataTypes.BOOLEAN, defaultValue: false },
});

class CartModel {
  static async getModel() {
    // Ensure the database schema is synchronized
    await sequelize.sync();
    await CartModel.seedTestData(); // Seed test data
    return Cart;
  }

  static async seedTestData() {
    const testItems = [
      { productId: "prod-123", quantity: 2, isSaved: false }, // Cart item
      { productId: "prod-456", quantity: 1, isSaved: false }, // Cart item
      { productId: "prod-789", quantity: 3, isSaved: true },  // Saved-for-later item
    ];

    // Check if the database already has items
    const itemCount = await Cart.count();
    if (itemCount === 0) {
      console.log("Seeding test data...");
      await Cart.bulkCreate(testItems);
    } else {
      console.log("Test data already exists.");
    }
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
    item.isSaved = true;
    await item.save();
    return item;
  }

  async moveToCart(itemId) {
    const item = await Cart.findByPk(itemId);
    item.isSaved = false;
    await item.save();
    return item;
  }
}

export default CartModel;

