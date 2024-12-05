// AuthRoutes ： Haiyi
// **Description**: Define the API routes for handling authentication actions, including login, registration, and logout. 
  // The routes should handle requests from the frontend to
    // authenticate users, validate credentials, and issue tokens for session management. 
  // Additionally, include routes for handling the user’s session, such as logging out and token revocation
// **Tag**: #66
// **Owner**: Haiyi
// **Expected Outcome**: A set of routes that facilitate login, register, reset password, and logout operations for user authentication.

/* Integration:
  *- Connect to AuthController.js to handle user authentication logic, including:
      registration | login validation | password rest | logout 
  *- Enforce authentication and authorization through AuthMiddleware.js to ensure:
      secure access to sensitive routes, particularly for actions like registration and login,
      protect routes that require an authenticated user.
  *- Interact with UserModel.js for managing user data and storing credentials securely.
*/

import express from "express";
import { registerUser, verifyEmail, login, logout, requestPasswordReset, resetPassword, becomeSeller } from "../controllers/AuthController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";

// Create API routes for user authentication, including:
const router = express.Router();

/* 1. POST/ auth/register:
 * Route to register a new user:
*/
router.post("/register", registerUser);

/* 2. POST/ auth/login:
  - Authenticate a user with email and password.
  - Rate limiting.
  - Error messages that avoid revealing whether email or password is incorrect.
  - Generate a token for successful login.
  - Return a response with the token for client-side storage (e.g., in cookies or localStorage).
*/
// TODO Route to verify the email address of a user after they register:
// router.get("/verify-email", verifyEmail);

// Route for users to log in:
router.post("/login", login);

/* 3. POST/ auth/logout:
 * Route to log out the user (invalidates the versionToken):
*/
router.post("/logout", authMiddleware, logout);

/* 4. POST/ auth/request-password-reset:
  - The route accepts a POST request containing the user's email address or user ID (or both).
  - Verify the user: The system checks if the provided email or user ID exists in the database (via **_UserModel.js_**).
  - Error Handling.
  - If the user exists, the server will generate a unique reset token (a temporary token stored in the database or generated dynamically).
  - Save the reset token: This reset token is stored in the **_UserModel.js_**  in the database with an expiration time.
  - The reset token can be sent back to the frontend for the user to enter in the next step of the process.
  - The system should ensure that each reset token is one-time use and expires after a set time (for security reasons).
  - Rate limiting.
*/
// Route to request a password reset (via email):
router.post("/request-password-reset", requestPasswordReset);
// Route to reset the user's password:
router.post("/reset-password", resetPassword);

/* 5. POST/ auth/become-seller:
  - Authorize the user as seller.
*/
// Route to update the user's role to 'seller':
  // TODO Add more roles here for other access levels if needed.
router.post("/become-seller", authMiddleware, verifyRole("user"), becomeSeller); 

export default router;


/* Coder Note 
  *4* Set Up the API Routes: AuthRoutes
    AuthRoutes serves as the bridge between the frontend and backend logic, 
    forwarding requests to the AuthController.
  *Logic:
  - Define routes like POST /auth/login, POST /auth/register, and POST /auth/reset-password.
  - Add middleware to secure routes that need authentication.
  - Dependencies: AuthRoutes depends on AuthMiddleware and RoleMiddleware to 
      secure the routes and on AuthController to handle requests.
*/