// AuthMiddleware : Haiyi
// **Description**:  Implement middleware to protect routes that require authentication.
    // This middleware checks for a valid session/ token before allowing access to protected endpoints. 
    // If the user is unauthenticated, it returns a [ 401 Unauthorized] error and prevent further access to the route.
// **Tag**: #73
// **Owner**: Haiyi
// **Expected Outcome**:  Ensures user has valid session/ token and blocks unauthenticated access.

/* Works with UserModel.js to retrieve and validate user data as needed. It's used in routes that 
require user authentication: profile updates, placing orders, accessing user-specific data, etc. 
*/
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

// Validates user credentials by checking the authentication token or session associated with the incoming request.
const authMiddleware = async (req, res, next) => {
  /* 1. Token Validation:
  - Verifies if a token is present in the Authorization header of the request.
  - Decodes and validates the token to ensure it is valid, not expired, and issued by the server.
  */
  try {
    // const token = req.headers.authorization; // TODO Assuming the token is sent in the Authorization header as "Bearer <token>"
        const token = req.header("authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthenticated: No token provided, access denied." });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  /* 2. Attach User Info:
  - Extracts user details from the token.
  - Attaches them to the request object for downstream use.
  */
    const user = await UserModel.getUserById(decodedToken.userId);
  /*3. Error Handling:
  - Responds with a 401_Unauthorized error if the token is missing or invalid.
  - Responds with a 40_3Forbidden error if access is denied for any other reason.
  */
    if (!user) {
      return res.status(403).json({ error: "Unauthorized: access denied." });
    }
    if (user.tokenVersion != decodedToken.tokenVersion) {
      return res.status(401).json({ error: "Unauthorized: Token is invalid, Please log in again." });
    }

    // Attach user info to request object for next middleware or route
    req.user = { userId: user.userId };   
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(500).json({ error: "An unexpected error occurred while giving authentication." });
  }
};

export default authMiddleware;
/* Coder Note 
  *2* Develop the Middleware: AuthMiddleware and RoleMiddleware
    Middleware ensures route security. It’s critical to verify user authentication and roles
    before granting access to controllers and protected routes.
  *Logic:
  - AuthMiddleware: Checks if a valid token/session exists before proceeding to protected routes.
  - RoleMiddleware: Checks the user’s role (e.g., "admin", "user") to allow or restrict access to role-specific routes.
  - Dependencies: The middleware will use the UserModel to validate tokens and roles.
*/