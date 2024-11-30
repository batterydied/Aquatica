import ProductModel from "../models/ProductModel.js";
class ProductController {
  constructor() {
    this.model = ProductModel; // Associate the controller with the ProductModel abstraction
  }

  // Retrieve all products from the database
  async getAllProducts(req, res) {
    try {
      const products = await this.model.read(); // Use the read method to fetch all products
      res.status(200).json(products);
    } catch (error) {
      console.error("Error retrieving products:", error);
      res.status(500).json({ error: "Failed to retrieve products" });
    }
  }

  // Retrieve a specific product by ID
  async getProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await this.model.read(id); // Use the read method to fetch a single product

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error("Error retrieving product:", error);
      res.status(500).json({ error: "Failed to retrieve product" });
    }
  }

  // Add a new product to the database
  async addProduct(req, res) {
    try {
      const { name, sellerid, sellername, imgurl, category, description, price } = req.body;

      // Validate input
      if (!name || !sellerid || !sellername || !category || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create a new product using the create method
      const newProduct = await this.model.create({
        name,
        sellerid,
        sellername,
        imgurl,
        category,
        description,
        price,
        average_rating: null,
        numreviews: 0,
      });

      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Failed to add product" });
    }
  }

  // Update an existing product
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Update the product using the update method
      const updatedProduct = await this.model.update(id, updates);
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ status: "Product updated successfully", updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  }

  // Delete a product by ID
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      // Delete the product using the delete method
      const result = await this.model.delete(id);
      if (!result) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ status: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
}

export default new ProductController();
