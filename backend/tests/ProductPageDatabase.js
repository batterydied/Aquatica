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
      secondaryname: 'Amphiprioninae',
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

    // To add reviews for the product, follow the same process as adding images.
    // First, define the mock review data with the necessary fields (e.g., rating, comment, reviewer name).
    // Then, use the `bulkCreate` method to insert the reviews into the database.
    // Example (You should check the ProductModel beforehand to make sure the schema is correct):

    // const mockReviews = [
    //   { productId: product.prodid, rating: 5, comment: 'Amazing fish, very vibrant!', reviewer: 'John Doe' },
    //   { productId: product.prodid, rating: 4, comment: 'Great quality, arrived healthy.', reviewer: 'Jane Smith' },
    // ];

    // await Review.bulkCreate(mockReviews);

    // Ensure the `Review` model is properly imported from the models file before adding reviews.


    console.log('Mock data added successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initializeDatabase;
