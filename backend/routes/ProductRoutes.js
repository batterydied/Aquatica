/*
 ProductRoutes: Benson
 Description: This file defines the API endpoints for managing product-related 
              operations. It maps HTTP requests to the corresponding methods 
              in the `ProductController`, enabling interaction between the frontend 
              and backend for product functionality.
 Issue: #90, #104, #105, #106, #107
 Owner: Benson
 Expected Outcome: A fully functional and modular routing system that 
                   handles product-related requests such as fetching, adding, 
                   updating, and deleting products.
 */

import express from "express";
import ProductController from "../controllers/ProductController.js";

class ProductRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Fetch all products
    this.router.get("/products", (req, res) => ProductController.getAllProducts(req, res));

    // Fetch a single product by ID
    this.router.get("/products/:id", (req, res) => ProductController.getProduct(req, res));

    // Add a new product
    this.router.post("/products", (req, res) => ProductController.addProduct(req, res));

    // Update an existing product
    this.router.put("/products/:prodid", (req, res) => ProductController.updateProduct(req, res));

    // Delete a product by ID
    this.router.delete("/products/:prodid", (req, res) => ProductController.deleteProduct(req, res));
  }
}

export default new ProductRoutes().router; // Export the router instance
