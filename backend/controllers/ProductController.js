// ProductController
import ProductModel from "../models/ProductModel.js";

class ProductController {
    constructor() {
        this.model = ProductModel;
    }

    async getAllProducts(req, res) {
        /* Retrieves all products from the database
           Response will be an object with a property containing an array of product objects */
           const products = await this.model.read(); // argument is empty, meaning it will get all products
           res.json({ products });
    }

    async getProduct(req, res) {
        /* Retrieves the product with the given id in the request
           Response will be an object with a property containing the product object
           TODO: Implement this method */
    }

    async addProduct(req, res) {
        /* Adds a new product to the database
           Response will be an object with a property containing the generated product id
           TODO: Implement this method */
    }

    async updateProduct(req, res) {
        /* Updates the product with the given data in the request
           Response will be an object with a status indicating either success or failure
           TODO: Implement this method */

    }

    async deleteProduct(req, res) {
        /* Deletes the product with the given id in the request
           Response will be an object with a status indicating either success or failure
           TODO: Implement this method */
    }
}

export default new ProductController();