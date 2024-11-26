// ProductRoutes

import express from "express";
import ProductController from "../controllers/ProductController.js";

class ProductRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Defines routes

        /* GET /products/[productid] retrieve the product with the specified product id.
           TODO: Implement this route */

        /* GET /products/all retrieve all products in the database.
           TODO: Implement this route */

        /* POST /products create a new product.
           TODO: Implement this route */

        /* PUT /products/[productid] update an existing product with the specified product id.
           TODO: Implement this route */

        /* DELETE /products/[productid] delete an existing product with the specified product id 
           TODO: Implement this route */
    }
}