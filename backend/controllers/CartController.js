/*
  CartController: Devin
  Description: This file serves as the controller for managing cart-related 
               operations, interfacing between the model and the API endpoints.
  Issue: #53
  Owner: Devin
  Expected Outcome: A controller that seamlessly handles cart-related API requests
                    such as fetching cart/saved items, adding, removing, saving,
                    or updating items.

  Interface with the CartModel to manage data flow between the frontend and database.

  - Method: getCartItems(): Fetch all cart items for a user, excluding saved items.
  - Method: getSavedItems(): Fetch all saved items for a user.
  - Method: addCartItem(): Add a new item to the user's cart.
  - Method: removeCartItem(): Remove a specific cart item by its ID.
  - Method: saveForLater(): Mark a cart item as saved for later.
  - Method: moveToCart(): Move a saved item back into the cart.
  - Method: updateCartItem(): Update the quantity of a specific cart item.
*/

// Imports
import CartModel from "../models/CartModel.js";

class CartController {
  constructor() {
    this.initializeModel();
  }

  /**
   * Initialize the CartModel.
   */
  async initializeModel() {
    try {
      this.model = await CartModel.init();
      console.log("CartController: Model initialized successfully.");
    } catch (error) {
      console.error("CartController: Failed to initialize model.", error);
    }
  }

  /**
   * Fetch all cart items for the signed-in user.
   */
  async getCartItems(req, res) {
    try {
      const userId = req.user?.id || "test-user-id"; // Using a default userId for testing
      // const userId = req.user.id; // Get the signed-in user's ID
      const items = await CartModel.getItems(userId, false);
      res.json({ items });
    } catch (error) {
      console.error("Error in getCartItems:", error);
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  }

  /**
   * Fetch all saved-for-later items for the signed-in user.
   */
  async getSavedItems(req, res) {
    try {
      const userId = req.user.id;
      const items = await CartModel.getItems(userId, true);
      res.json({ items });
    } catch (error) {
      console.error("Error in getSavedItems:", error);
      res.status(500).json({ error: "Failed to fetch saved-for-later items" });
    }
  }

  /**
   * Add a new item to the cart.
   */
  async addCartItem(req, res) {
    try {
      const userId = req.user?.id || "test-user-id"; // Use a default userId for testing
      /* 
      const userId = req.user.id;
      const { productId, quantity } = req.body;
      const newItem = await CartModel.addCartItem(productId, quantity, userId);
      */
      const { productId, price, description, quantity } = req.body;

      const newItem = await CartModel.addCartItemManually(
        productId,
        price,
        description,
        quantity,
        userId
      );

      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error in addCartItem:", error);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  }

  /**
   * Remove an item from the cart.
   */
  async removeCartItem(req, res) {
    try {
      const userId = req.user?.id || "test-user-id"; // Placeholder for userId
      const itemId = req.params.id;
      await CartModel.removeCartItem(itemId, userId);
      res.status(200).json({ message: "Item removed successfully" });
    } catch (error) {
      console.error("Error in removeCartItem:", error);
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  }

  /**
   * Save an item for later.
   */
  async saveForLater(req, res) {
    try {
      const userId = req.user?.id || "test-user-id"; // Placeholder for userId
      const itemId = req.params.id;
      const updatedItem = await CartModel.saveForLater(itemId, userId);
      res.status(201).json(updatedItem);
    } catch (error) {
      console.error("Error in saveForLater:", error);
      res.status(500).json({ error: "Failed to save item for later" });
    }
  }

  /**
   * Move a saved item back to the cart.
   */
  async moveToCart(req, res) {
    try {
      const userId = req.user?.id || "test-user-id"; // Placeholder for userId
      const itemId = req.params.id;
      const updatedItem = await CartModel.moveToCart(itemId, userId);
      res.status(201).json(updatedItem);
    } catch (error) {
      console.error("Error in moveToCart:", error);
      res.status(500).json({ error: "Failed to move item to cart" });
    }
  }
}

export default new CartController();
