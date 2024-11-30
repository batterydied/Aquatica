// ProductController
const products = [
    { id: 1, name: 'Product A', description: 'Description for Product A', price: 100 },
    { id: 2, name: 'Product B', description: 'Description for Product B', price: 200 },
];

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

export {getAllProducts, getProductById, addProduct}