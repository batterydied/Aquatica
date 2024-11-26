// Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleGlobalError } from './utils/ErrorHandler.js';
// import AuthRoutes from './routes/AuthRoutes.js';
// import CartRoutes from './routes/CartRoutes.js';
// import OrderRoutes from './routes/OrderRoutes.js';
// import ProductRoutes from './routes/ProductRoutes.js';
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
      origin: 'http://localhost:8000', // Allow the frontend for communication
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
      credentials: true,
    }));

    // Serve static files
    this.app.use(express.static("../frontend/main"));
  }

  // Setup routes
  setupRoutes() {
    // this.app.use('/api', AuthRoutes);
    // this.app.use('/api', CartRoutes);
    // this.app.use('/api', OrderRoutes);
    // this.app.use('/api', ProductRoutes);
    // this.app.use('/api', ProfileRoutes);

    // Global error handler
    this.app.use(handleGlobalError);
  }

  start(port = process.env.PORT || 3000) {
    this.app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  }
}

// Initialize and start the server
console.log("Starting server...");
const server = new Server();
server.start(); 
