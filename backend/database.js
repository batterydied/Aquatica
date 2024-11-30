import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const environment = process.env.NODE_ENV || 'development';

const config = {
  development: {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, process.env.DB_STORAGE || 'database.sqlite'), // Use __dirname to ensure path is relative to backend folder
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:', // In-memory database for testing
    logging: console.log,
  },
};

// Log the resolved storage path for debugging
if (environment === 'development') {
  console.log('Resolved DB storage path:', config.development.storage);
}

// Initialize Sequelize with the environment-specific configuration
const sequelize = new Sequelize(config[environment]);

export default sequelize;
