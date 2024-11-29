// CartController
import CartModel from "../models/CartModel.js";

class CartController {
  construstor() {
    CartModel.getModel().then((model) => {
      this.model = model;
    });
  }

  async getCartItems(req, res) {
    const items = await CartModel.getCartItems();
    res.json({ items });
  }

  async addCartItem(req, res) {
    const item = req.body;
    const newItem = await CartModel.addCartItem(item);
    res.status(201).json(newItem);
  }

  async removeCartIem(req, res) {
    const itemId = req.params.id;
    await CartModel.removeCartIem(itemId);:w
    res.status(200).send();
  }

    async saveForLater(req, res) {
    const itemId = req.params.id;
    const savedItem = await CartModel.saveForLater(itemId);
    res.status(201).json(savedItem);
  }

  async moveToCart(req, res) {
    const itemId = req.params.id;
    const movedItem = await CartModel.moveToCart(itemId);
    res.status(201).json(movedItem);
  }
}

export default new CartController();
