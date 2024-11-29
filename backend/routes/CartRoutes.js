// CartRoutes
import express from "express";
import CartController from "../controllers/CartController.js";

class CartRoutes {
  constructor(){
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Cart-related endpoints
    router.get("/cart", async (req, res) => await CartController.getCartItems(req, res));
    router.post("/cart", async (req, res) => await CartController.addCartItem(req, res));
    router.delete("cart/:id" async (req, res) => await CartController.removeCartItem(req, res));

    // Save for later endpoints
    router.post("/cart/save/:id", async (req, res) => await CartController.saveForLater(req, res));
    router.post("/cart/move/:id", async (req, res) => await CartController.moveToCart(req, res));

  }

  getRouter(){
    return this.router;
  }
}

export default new CartRoutes().getRouter();
