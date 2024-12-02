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
      origin: ['http://10.0.0.158:8080', 'http://localhost:8000'], // Allow the frontend for communication
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
      credentials: true,
    }));

    // Serve static files
<<<<<<< HEAD
    this.app.use(express.static(path.join(root, 'frontend')));
=======
    this.app.use(express.static("../frontend/main"));
>>>>>>> main
  }

  // Setup routes
  setupRoutes() {
<<<<<<< HEAD
    console.log("Registering routes...");
    // this.app.use('/api', AuthRoutes);
    // this.app.use('/api/cart', CartRoutes);
    // this.app.use('/api', OrderRoutes);
    // this.app.use('/api', ProductRoutes);
    // this.app.use('/api', ProfileRoutes);
    // Add /api/cart prefix to all CartRoutes
    this.app.use('/api/cart', (req, res, next) => {
        console.log(`Route hit: ${req.method} ${req.url}`);
        next();
    }, CartRoutes);

    console.log("Routes successfully registered.");
    // Global error handler
    this.app.use(handleGlobalError);

    // Log all registered routes
    const routes = [];
    this.app._router.stack.forEach((middleware) => {
        if (middleware.route) { // Route middleware
            const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
            routes.push({ path: middleware.route.path, methods });
        }
    });
    console.log('Registered Routes:', routes);
}

=======
    // this.app.use('/api', AuthRoutes);
    // this.app.use('/api', CartRoutes);
    // this.app.use('/api', OrderRoutes);
    // this.app.use('/api', ProductRoutes);
    // this.app.use('/api', ProfileRoutes);

    // Global error handler
    this.app.use(handleGlobalError);
  }
>>>>>>> main

  start(port = process.env.PORT || 3000) {
    this.app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
<<<<<<< HEAD
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(root, 'frontend', 'index.html'));
    });
=======
>>>>>>> main
  }
}

// Initialize and start the server
console.log("Starting server...");
const server = new Server();
<<<<<<< HEAD
server.start();
//initializeDatabase(); 
=======
server.start(); 
>>>>>>> main
