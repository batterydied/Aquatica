import sequelize from '../database.js';
import { DataTypes } from 'sequelize';

// Define models
const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  scientificName: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: true },
  discountPrice: { type: DataTypes.FLOAT, allowNull: true },
  availability: { type: DataTypes.STRING, allowNull: true },
  category: { type: DataTypes.STRING, allowNull: true },
  rating: { type: DataTypes.FLOAT, allowNull: true },
  reviewsCount: { type: DataTypes.INTEGER, allowNull: true },
});

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true },
  date: { type: DataTypes.DATE, allowNull: false },
});

const Image = sequelize.define('Image', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: DataTypes.STRING, allowNull: false },
});

const ProductType = sequelize.define('ProductType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
});

// Define relationships
Review.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Review, { foreignKey: 'productId' });

Image.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Image, { foreignKey: 'productId' });

ProductType.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(ProductType, { foreignKey: 'productId' });

// Export all models and sequelize instance
export { sequelize, Product, Review, Image, ProductType };
