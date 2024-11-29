import { Sequelize } from 'sequelize';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

// Determine the environment (default is 'development')
const environment = process.env.NODE_ENV || 'development';

const config = {
  development: {
    dialect: process.env.DB_DIALECT,
    storage: path.resolve(process.env.DB_STORAGE), // File-based SQLite database
  },
  test: {
    dialect: process.env.DB_DIALECT,
    storage: ':memory:', // In-memory SQLite database for testing
    logging: false, // Disable logging for cleaner test output
  },
  /*production: {
    dialect: 'postgres', // Replace with your production database (e.g., PostgreSQL)
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false, // Disable logging in production
  },*/
};

// Create a Sequelize instance based on the current environment
const sequelize = new Sequelize(config[environment]);

export default sequelize;
