import CartModel from "../models/CartModel.js";

class CartController {
  constructor() {
    this.initializeModel();
  }

  async initializeModel() {
    try {
      this.model = await CartModel.getModel();
      console.log("CartController: Model initialized successfully.");
    } catch (error) {
      console.error("CartController: Failed to initialize model.", error);
    }
  }

  async getCartItems(req, res) {
    try {
      console.log("CartController: getCartItems called.");
      if (!this.model) {
        throw new Error("CartController: Model is not initialized.");
      }
      const items = await this.model.findAll({ where: { isSaved: false } });
      res.json({ items });
    } catch (error) {
      console.error("Error in getCartItems:", error);
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  }

  async addCartItem(req, res) {
    try {
      console.log("CartController: addCartItem called.");
      if (!this.model) {
        throw new Error("CartController: Model is not initialized.");
      }
      const item = req.body;
      const newItem = await this.model.create(item);
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error in addCartItem:", error);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  }

  async removeCartItem(req, res) {
    try {
      console.log("CartController: removeCartItem called.");
      if (!this.model) {
        throw new Error("CartController: Model is not initialized.");
      }
      const itemId = req.params.id;
      await this.model.destroy({ where: { id: itemId } });
      res.status(200).send();
    } catch (error) {
      console.error("Error in removeCartItem:", error);
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  }

  async saveForLater(req, res) {
    try {
      console.log("CartController: saveForLater called.");
      if (!this.model) {
        throw new Error("CartController: Model is not initialized.");
      }
      const itemId = req.params.id;
      const item = await this.model.findByPk(itemId);
      item.isSaved = true;
      await item.save();
      res.status(201).json(item);
    } catch (error) {
      console.error("Error in saveForLater:", error);
      res.status(500).json({ error: "Failed to save item for later" });
    }
  }

  async moveToCart(req, res) {
    try {
      console.log("CartController: moveToCart called.");
      if (!this.model) {
        throw new Error("CartController: Model is not initialized.");
      }
      const itemId = req.params.id;
      const item = await this.model.findByPk(itemId);
      item.isSaved = false;
      await item.save();
      res.status(201).json(item);
    } catch (error) {
      console.error("Error in moveToCart:", error);
      res.status(500).json({ error: "Failed to move item to cart" });
    }
  }
}

export default new CartController();

