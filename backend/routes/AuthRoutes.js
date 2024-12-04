/**
 * AuthRoutes: Haiyi
 * Description: Define the API endpoints for user authentication, including login,
 *              registration, email verification, and password reset.
 * Issue: #66
 * Owner: Haiyi
 * Expected Outcome: A fully functional and modular routing system for user authentication.
 */

// Imports
import express from "express";
import {
  registerUser,
  login,
  logout,
  requestPasswordReset,
  resetPassword,
  becomeSeller,
} from "../controllers/AuthController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";

// AuthRoutes Class
class AuthRoutes {
  /**
   * Constructor for AuthRoutes.
   * Initializes the Express Router and sets up routes.
   */
  constructor() {
    this.router = express.Router(); // Initialize the router
    this.initializeRoutes(); // Define all routes
  }

  /**
   * Define all authentication-related API routes.
   */
  initializeRoutes() {
    // Register a new user
    this.router.post("/register", (req, res) => {
      console.log("POST /api/auth/register called.");
      registerUser(req, res);
    });

    // Login a user
    this.router.post("/login", (req, res) => {
      console.log("POST /api/auth/login called.");
      login(req, res);
    });

    // Logout a user
    this.router.post("/logout", authMiddleware, (req, res) => {
      console.log("POST /api/auth/logout called.");
      logout(req, res);
    });

    // Request password reset
    this.router.post("/request-password-reset", (req, res) => {
      console.log("POST /api/auth/request-password-reset called.");
      requestPasswordReset(req, res);
    });

    // Reset password
    this.router.post("/reset-password", (req, res) => {
      console.log("POST /api/auth/reset-password called.");
      resetPassword(req, res);
    });

    // Become a seller
    this.router.post("/become-seller", authMiddleware, verifyRole("user"), (req, res) => {
      console.log("POST /api/auth/become-seller called.");
      becomeSeller(req, res);
    });
  }

  /**
   * Return the configured router instance.
   * @returns {Router} - Express Router instance with all auth routes.
   */
  getRouter() {
    return this.router;
  }
}

// Export the AuthRoutes instance
export default new AuthRoutes().getRouter();

