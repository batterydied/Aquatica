// ProductRoutes.js
import express from 'express';

const router = express.Router();

// Example product data (in a real app, this would come from a database)
const products = [
    { id: 1, name: 'Product A', description: 'Description for Product A', price: 100 },
    { id: 2, name: 'Product B', description: 'Description for Product B', price: 200 },
];

// Controller functions
const getAllProducts = (req, res) => {
    res.status(200).json(products);
};

const getProductById = (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
};

const addProduct = (req, res) => {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newProduct = {
        id: products.length + 1,
        name,
        description,
        price,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
};

// Define routes
router.get('/products', getAllProducts);          // Fetch all products
router.get('/products/:id', getProductById);     // Fetch a single product by ID
router.post('/products', addProduct);            // Add a new product

export default router;
