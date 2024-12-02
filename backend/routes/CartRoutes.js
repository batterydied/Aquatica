// CartRoutes.js
import express from "express";
import CartController from "../controllers/CartController.js";

class CartRoutes {
  constructor() {
    this.router = express.Router(); // Properly initialize the router
    this.initializeRoutes();
  }

initializeRoutes() {
    // Cart endpoints
    this.router.get("/", (req, res) => {
        console.log("GET /api/cart called.");
        CartController.getCartItems(req, res);
    });

    this.router.post("/", (req, res) => {
        console.log("POST /api/cart called.");
        CartController.addCartItem(req, res);
    });

    this.router.delete("/:id", (req, res) => {
        console.log(`DELETE /api/cart/${req.params.id} called.`);
        CartController.removeCartItem(req, res);
    });

    // Saved-for-later endpoints
    this.router.get("/saved", (req, res) => {
        console.log("GET /api/cart/saved called.");
        CartController.getSavedItems(req, res); // Use the defined method
    });


    this.router.post("/save/:id", (req, res) => {
        console.log(`POST /api/cart/save/${req.params.id} called.`);
        CartController.saveForLater(req, res);
    });

    this.router.post("/move/:id", (req, res) => {
        console.log(`POST /api/cart/move/${req.params.id} called.`);
        CartController.moveToCart(req, res);
    });

    this.router.put("/:id", (req, res) => {
      console.log(`PUT /api/cart/${req.params.id} called.`);
      CartController.updateCartItem(req, res);
    });
  
}


  getRouter() {
    return this.router; // Return the router instance
  }
}

export default new CartRoutes().getRouter();

