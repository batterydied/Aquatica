import { sequelize, Product, Review, Image, ProductType } from '../models/ProductModel.js';

const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Force re-creation of tables for testing
    console.log('Database synced successfully.');

    // Optional: Add mock data
    const product = await Product.create({
      name: 'Clownfish',
      scientificName: 'Amphiprioninae',
      description: 'Bright and vibrant saltwater fish.',
      price: 25.99,
      discountPrice: 20.99,
      availability: 'In Stock',
      category: 'Saltwater Fish',
      rating: 4.8,
      reviewsCount: 45,
    });

    await Review.create({
      user: 'JohnD123',
      rating: 5,
      comment: 'Beautiful fish!',
      date: new Date(),
      productId: product.id,
    });

    await Image.bulkCreate([
      { url: 'clownfish1.jpg', productId: product.id },
      { url: 'clownfish2.jpg', productId: product.id },
    ]);

    await ProductType.bulkCreate([
      { type: 'Small', price: 10.99, productId: product.id },
      { type: 'Medium', price: 15.99, productId: product.id },
    ]);

    console.log('Mock data added successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initializeDatabase;
