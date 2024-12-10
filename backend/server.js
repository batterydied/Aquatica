// Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleGlobalError } from './utils/ErrorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import './database.js';
// import initializeDatabase from './tests/ProductPageDatabase.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.dirname(__dirname);

// import AuthRoutes from './routes/AuthRoutes.js';
import CartRoutes from './routes/CartRoutes.js';
import ProductRoutes from './routes/ProductRoutes.js';
import OrderRoutes from './routes/OrderRoutes.js';
// import ProfileRoutes from './routes/ProfileRoutes.js';

dotenv.config();

class Server {
  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.setupRoutes();
  }

  // Setup our middleware like express and cors.
  configureMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(cors({
      origin: ['http://10.0.0.158:8080', 'http://192.168.56.1:8080'], // Allow the frontend for communication
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
      credentials: true,
    }));

    // Serve static files
    this.app.use(express.static(path.join(root, 'frontend')));
  }

  setupRoutes() {
    console.log("Registering routes...");
    this.app.use('/api', ProductRoutes);
    this.app.use('/api/cart', CartRoutes);
    this.app.use('/api/order', OrderRoutes);
    this.app.use(handleGlobalError);
  }

  start(port = process.env.PORT || 3000) {
    this.app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(root, 'frontend', 'index.html'));
    });
  }
}

// Initialize and start the server
console.log("Starting server...");
const server = new Server();
server.start();

//initializeDatabase(); 

