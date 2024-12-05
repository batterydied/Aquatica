import sequelize from '../database.js';
import { DataTypes } from 'sequelize';
//
// Define models
const Product = sequelize.define("Product", {
  prodid: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  secondaryname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sellerid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  sellername: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
});

const Review = sequelize.define("Review", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true },
  date: { type: DataTypes.DATE, allowNull: false },
});

const Image = sequelize.define("Image", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: DataTypes.STRING, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
});

const ProductType = sequelize.define("ProductType", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
});

// Define relationships
Review.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Review, { foreignKey: "productId" });

Image.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Image, { foreignKey: "productId" });

ProductType.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(ProductType, { foreignKey: "productId" });

class _ProductModel {
  constructor() {
    this.models = { Product, Review, Image, ProductType };
  }

  async init() {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      console.log("Database synced successfully.");
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }

  async create(productData) {
    try {
      const product = await Product.create(productData);
      return product;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async read(id = null, options = {}) {
    try {
      if (id) {
        return await Product.findByPk(id, { ...options }); // Pass options for relationships
      }
      return await Product.findAll({ ...options }); // Fetch all products with options
    } catch (error) {
      console.error("Error reading product(s):", error);
      throw error;
    }
  }
  

  async update(id, updates) {
    try {
      const product = await Product.findByPk(id);
      if (!product) throw new Error("Product not found");
      await product.update(updates);
      return product;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) throw new Error("Product not found");
      await product.destroy();
      return { message: "Product deleted successfully." };
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}

const ProductModel = new _ProductModel();
export default ProductModel;
export { Product, Review, Image, ProductType };
