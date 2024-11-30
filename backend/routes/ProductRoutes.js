// ProductRoutes.js
import express from 'express';
import { getAllProducts, getProductById, addProduct } from '../controllers/ProductController.js';

const router = express.Router();

// Define routes
router.get('/products', getAllProducts);          // Fetch all products
router.get('/products/:id', getProductById);     // Fetch a single product by ID
router.post('/products', addProduct);            // Add a new product
export default router;
