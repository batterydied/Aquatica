import ProductModel from '../models/ProductModel.js';
import { Image } from '../models/ProductModel.js'; // Import the Image model

const initializeDatabase = async () => {
  try {
    // Initialize the database connection
    await ProductModel.init();
    console.log('Database initialized successfully.');

    // Optional: Add mock product data
    const mockProduct = {
      prodid: '1a2b3c4d5e',
      name: 'Clownfish',
      sellerid: '1234-5678',
      sellername: 'Ocean Wonders',
      category: 'Saltwater Fish',
      description: 'Bright and vibrant saltwater fish.',
      price: 25.99,
      average_rating: 4.8,
      numreviews: 45,
    };

    const product = await ProductModel.create(mockProduct);

    // Add mock images for the product
    const mockImages = [
      { url:  "https://scitechdaily.com/images/Clownfish-Art-Concept-Illustration.jpg", productId: product.prodid },
      { url: "https://cdn.shopify.com/s/files/1/0311/3149/files/discus.jpg?v=1682104559", productId: product.prodid },
    ];

    await Image.bulkCreate(mockImages);

    console.log('Mock data and images added successfully:', product);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initializeDatabase;
