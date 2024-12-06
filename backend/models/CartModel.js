
/*
  CartModel: Devin
  Description: This file handles making a template for each item in cart, and
               defines methods that allow easy access for storing and getting
               information from the database.
  Issue: #55
  Owner: Devin
  Expected Outcome: A cart model that effectivly makes a cart item model template,
                    and will save, get, remove, or move items in a cart.

Interface with database.sqlite to manage fetching and adding data in the database.
  - Method: Init(): Syncing the database.
  - Method: getCartItems(): Fetch all cart items with matching userId, to display in cart.
  - Method: getSavedItems(): Fetch all saved items with matching userId, to display in saved.
  - Method: addCartItem(): Adds a new item to the database with details from productModel.
  - Method: addCartItemManually(): Adds a new item to the database if there are no products in DB.
  - Method: removeCartItem(): Removes a specific cart Id from the database.
  - Method: saveForLater(): Sets the isSaved value to true, in the database.
  - Method: moveToCart(): Sets the isSaved value to false, in the database.
*/

// Imports
import { DataTypes } from "sequelize";
import sequelize from "../database.js";
// import { Product } from "./ProductModel.js";

// Define the Cart model
const Cart = sequelize.define("Cart", {
  name: { type: DataTypes.STRING, allowNull: false },
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.UUID, allowNull: false },
  // This will be uncommented when productModel is implemented.
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
  isSaved: { type: DataTypes.BOOLEAN, defaultValue: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },   
  description: { type: DataTypes.STRING, allowNull: false }, 
});

// Define relationships

/*
Cart.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Cart, { foreignKey: "productId" });
*/

// CartModel Class
class CartModel {
  /**
   * Initialize the database schema for Cart.
   */
  static async init() {
    await sequelize.sync();
    console.log("Cart and Product tables synced successfully.");
  }

  /**
   * Fetch items from the cart or saved-for-later based on `isSaved` status.
   * @param {string} userId - The ID of the user whose items are being fetched.
   * @param {boolean} isSaved - Whether to fetch saved items or regular cart items.
   * @returns {Promise<Array>} - List of items.
   */
  static async getItems(userId, isSaved) {
    return await Cart.findAll({
      where: { userId, isSaved },
      attributes: ["name", "id", "productId", "price", "description", "quantity", "isSaved", "userId"],

      // This will be uncommented when productModel is implemented.
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
  * Clear all items in the cart for a user.
  * @param {string} userId - The user's ID.
  */
  static async clearCart(userId) {
    await Cart.destroy({ where: { userId, isSaved: false } });
  }
  

  // This will be uncommented when productModel is implemented.
  /**
   * Add a new item to the cart.
   * @param {string} productId - The product's ID.
   * @param {number} quantity - Quantity of the product.
   * @param {string} userId - The ID of the user adding the item.
   * @returns {Promise<Object>} - The created cart item.
   
  static async addCartItem(productId, quantity, userId) {
    const product = await Product.findByPk(productId, {
      attributes: ["price", "description"],
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found.`);
    }

    return await Cart.create({
      productId,
      quantity,
      userId,
    });
  }
  */

  /**
   * For testing: Add a cart item without Product reference.
   */
  static async addCartItemManually(name, productId, price, description, quantity, userId) {
    return await Cart.create({
      name,
      productId,
      price,
      description,
      quantity,
      userId,
    });
  }

  /**
   * Remove an item from the cart.
   * @param {string} itemId - The cart item's ID.
   * @param {string} userId - The ID of the user removing the item.
   * @returns {Promise<Object>} - Confirmation of deletion.
   */
  static async removeCartItem(itemId, userId) {
    const deletedRows = await Cart.destroy({ where: { id: itemId, userId } });
    if (deletedRows === 0) {
      throw new Error(`Item not found or does not belong to the user.`);
    }
    return { message: "Cart item removed successfully." };
  }

  /**
   * Mark an item as saved for later.
   */
  static async saveForLater(itemId, userId) {
    const item = await Cart.findOne({ where: { id: itemId, userId } });
    if (!item) {
      throw new Error(`Item not found or does not belong to the user.`);
    }
    item.isSaved = true;
    await item.save();
    return item;
  }

  /**
   * Move an item from saved-for-later back to the cart.
   */
  static async moveToCart(itemId, userId) {
    const item = await Cart.findOne({ where: { id: itemId, userId } });
    if (!item) {
      throw new Error(`Item not found or does not belong to the user.`);
    }
    item.isSaved = false;
    await item.save();
    return item;
  }

  /**
   * Update the cart item quantity.
   */
  static async updateQuantity(itemId, quantity, userId) {
    const item = await Cart.findOne({ where: { id: itemId, userId } });

    if (!item) {
      throw new Error(`Item with ID ${itemId} not found for user.`);
    }

    item.quantity = quantity;
    await item.save();
    return item;
  }
  
}

export default CartModel;
export { Cart };
