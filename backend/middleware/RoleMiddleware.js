// RoleMiddleware : Haiyi
// **Description**:  Implement middleware to protect routes that require specific user roles.
    // This middleware checks the authenticated user's role and compares it against the required role for the route.
    // If the user is unauthorized, access will be blocked, and a [ 403 Forbidden ] error will be returned.
// **Tag**: #75
// **Owner**: Haiyi
// **Expected Outcome**: Checks the user's role and blocks unauthorized access.

/* Use the UserModel.js to validate tokens and roles.
  Used in conjunction with AuthMiddleware.js to ensure the user is authenticated before
  checking their roles. This middleware is commonly applied to routes requiring
  administrative or seller privileges, such as managing products or viewing system-wide data. 
*/

// Enforce role-based access control to ensure users can only perform actions or access resources allowed for their role: buyer/ seller/ admin.
/* 1. Role Verification:
  - Checks the roles attribute in the user object attached by AuthMiddleware.js.
  - Confirms the user has the required role(s) for the route.
 */

/* 2. Error Handling:
  - Responds with a 403 (Forbidden) error if the user lacks the necessary permissions.
*/

/* 3. Customizability:
  - Allows configuration of required roles per route for flexibility.
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