// CartController.js
import CartModel from "../models/CartModel.js";

class CartController {
  constructor() {
    CartModel.getModel().then((model) => {
      this.model = model;
    });
  }

  // Get all items in the cart
  async getCartItems(req, res) {
    try {
      const items = await this.model.getCartItems();
      res.json({ items });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  }

  // Add an item to the cart
  async addCartItem(req, res) {
    try {
      const item = req.body;
      const newItem = await this.model.addCartItem(item);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  }

  // Remove an item from the cart
  async removeCartItem(req, res) {
    try {
      const itemId = req.params.id;
      await this.model.removeCartItem(itemId);
      res.status(200).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  }

  // Save an item for later
  async saveForLater(req, res) {
    try {
      const itemId = req.params.id;
      const savedItem = await this.model.saveForLater(itemId);
      res.status(201).json(savedItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to save item for later" });
    }
  }

  // Move an item back to the cart
  async moveToCart(req, res) {
    try {
      const itemId = req.params.id;
      const movedItem = await this.model.moveToCart(itemId);
      res.status(201).json(movedItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to move item to cart" });
    }
  }
}

export default new CartController();

