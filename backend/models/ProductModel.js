// ProductModel.js
// A model for the product using sequelize

import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
});

// Defines the product data model
const Product = sequelize.define("Product", {
    prodid: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sellerid: { // refers to a unique user
        type: DataTypes.UUID,
        allowNUll: false,
    },
    sellername: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imgurl: {
        type: DataTypes.STRING,
        allowNull: true,
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
    average_rating: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    numreviews: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    /* other potential fields to include: 
    scientific name, 
    discount price, 
    availability, 
    tags, 
    specifications, 
    product types, 
    shipping info, 
    reviews, 
    related products */
});

class _ProductModel {
    constructor() {}

    async init() {
        /* Initializes the product model by connecting to the database
           Throws an exception on failure */
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    }

    async create(product) {
        /* Creates a new product 
           TODO: implement this method */
    }

    async read(id = null) {
        /* Returns an existing product with the given id,
           or all products if no id is given */
        if (id) {
            return await Product.findByPk(id);
        } else {
            return await Product.findAll();
        }
    }

    async update(product) {
        /* Updates a product with the given data 
           TODO: implement this method */
    }

    async delete(id) {
        /* Deletes the product with the given id 
           TODO: implement this method */
    }
}

const ProductModel = new _ProductModel();

export default ProductModel;