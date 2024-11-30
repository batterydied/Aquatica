import ProductModel from '../models/ProductModel.js';

const initializeDatabase = async () => {
  try {
    // Initialize the database connection
    await ProductModel.init();
    console.log('Database initialized successfully.');

    // Optional: Add mock data
    const mockProduct = {
      prodid: '1a2b3c4d5e',
      name: 'Clownfish',
      sellerid: '1234-5678',
      sellername: 'Ocean Wonders',
      imgurl: 'clownfish_main.jpg',
      category: 'Saltwater Fish',
      description: 'Bright and vibrant saltwater fish.',
      price: 25.99,
      average_rating: 4.8,
      numreviews: 45,
    };

    const product = await ProductModel.create(mockProduct);

    console.log('Mock data added successfully:', product);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initializeDatabase;
