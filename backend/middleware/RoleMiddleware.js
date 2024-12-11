// RoleMiddleware : Haiyi
// **Description**:  Implement middleware to protect routes that require specific user roles.
    // This middleware checks the authenticated user's role and compares it against the required role for the route.
    // If the user is unauthorized, access will be blocked, and a [ 403 Forbidden ] error will be returned.
// **Tag**: #75
// **Owner**: Haiyi
// **Expected Outcome**: Checks the user's role and blocks unauthorized access.

/* Used in conjunction with AuthMiddleware.js to ensure the user is authenticated before checking their roles.
  This middleware is commonly applied to routes requiring administrative or seller privileges,
  such as managing products or viewing system-wide data. 
*/

// Enforce role-based access control to ensure users can only perform actions or access resources allowed for their role.
export function verifyRole(requiredRole){
  return (req, res, next) => {
    try {
      if (!req.user) {                  // Ensure AuthMiddleware has attached a user object to the request.
        return res.status(401).json({ error: "No user found, access denied." });
      }
/* 1. Role Verification:
  - Checks the roles attribute in the user object attached by AuthMiddleware.js.
  - Confirms the user has the required role(s) for the route.
*/
      const userRole = req.user.roles;  // Extract role from authenticated user.
    // Check if the user has the required role
      if ( userRole !== requiredRole ) {
        return res.status(403).json({ error: "Access forbidden: unauthorized." });
      }  
      next();  
    } catch (error){
/* 2. Error Handling:
  - Responds with a 403 (Forbidden) error if the user lacks the necessary permissions.
*/
      console.error("Error in RoleMiddleware:", error);
      res.status(500).json({ error: "An unexpected error occurred while verifying roles." });
    }
  };
}