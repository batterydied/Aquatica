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

// Validates user credentials by checking the authentication token or session associated with the incoming request.
/* 1. Token Validation:
  - Verifies if a token is present in the Authorization header of the request.
  - Decodes and validates the token to ensure it is valid, not expired, and issued by the server.
*/

/* 2. Attach User Info:
  - Extracts user details from the token.
  - Attaches them to the request object for downstream use.
*/

/*3. Error Handling:
  - Responds with a 401_Unauthorized error if the token is missing or invalid.
  - Responds with a 403_Forbidden error if access is denied for any other reason.
*/

/* Coder Note 
  *2* Develop the Middleware: AuthMiddleware and RoleMiddleware
    Middleware ensures route security. It’s critical to verify user authentication and roles
    before granting access to controllers and protected routes.
  *Logic:
  - AuthMiddleware: Checks if a valid token/session exists before proceeding to protected routes.
  - RoleMiddleware: Checks the user’s role (e.g., "admin", "user") to allow or restrict access to role-specific routes.
  - Dependencies: The middleware will use the UserModel to validate tokens and roles.
*/