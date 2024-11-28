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

        /* DESCRIPTION:
            Get all products. Returns an object containing an array of all products.
           REQUEST:
            GET /products
           RESPONSE:
            { "tasks": [ ... ] }
           STATUS CODES:
            200 - OK
            500 - Internal Server Error. */
        this.router.get("/products", async (req, res) => {
            await ProductController.getAllProducts(req, res);
        });

        /* POST /products create a new product.
           TODO: Implement this route */

        /* PUT /products/[productid] update an existing product with the specified product id.
           TODO: Implement this route */

        /* DELETE /products/[productid] delete an existing product with the specified product id 
           TODO: Implement this route */
    }
}