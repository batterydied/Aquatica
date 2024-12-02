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
        const items = await this.model.findAll({
            where: { isSaved: false },
            attributes: ['id', 'productId', 'quantity', 'price', 'description'], // Include these fields
        });
        res.json({ items });
    } catch (error) {
        console.error("Error in getCartItems:", error);
        res.status(500).json({ error: "Failed to fetch cart items" });
    }
}

async getSavedItems(req, res) {
    try {
        console.log("CartController: getSavedItems called.");
        if (!this.model) {
            throw new Error("CartController: Model is not initialized.");
        }
        const items = await this.model.findAll({
            where: { isSaved: true },
            attributes: ['id', 'productId', 'quantity', 'price', 'description'], // Include these fields
        });
        res.json({ items });
    } catch (error) {
        console.error("Error in getSavedItems:", error);
        res.status(500).json({ error: "Failed to fetch saved-for-later items" });
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
    const deletedCount = await this.model.destroy({ where: { id: itemId } });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Send a proper response after successful deletion
    res.status(200).json({ message: "Item removed successfully", itemId });
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


async updateCartItem(req, res) {
  try {
    console.log("CartController: updateCartItem called.");
    if (!this.model) {
      throw new Error("CartController: Model is not initialized.");
    }
    const itemId = req.params.id;
    const { quantity } = req.body;
    const item = await this.model.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Update the quantity and save the item
    item.quantity = quantity;
    await item.save();
    res.status(200).json(item); // Send updated item back to the frontend
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
}

}

export default new CartController();

