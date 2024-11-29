// UserModel : Haiyi
// **Description**:  Create a `UserModel` in Sequelize (database.sqlite) with:
    // attributes: userId, email, hashedPassword, and role. 
    // Add model-level validation for required fields and email format.
// **Tag**: #72
// **Owner**: Haiyi
// **Expected Outcome**: A functioning Sequelize model stored in SQLite, with appropriate validations. 

/* Integration:
  *- AuthController.js:     For authentication, user registration, and login/logout functionalities.
  *- AuthMiddleware.js:     For token validation and user access control.
  *- RoleMiddleware.js:     For enforcing role-based access permissions.
  *- ProfileController.js:  For fetching and updating user profile information.
  *- OrderController.js:    For associating user data with orders.
  *- Password Reset.js.js:  For managing password recovery and secure updates.
*/

// Design the database schema for user management. This schema will include:
// 1. Fields: |userId|email|hashedPassword|roles| +_timestamps_+

// 2. Methods:|create|retrieve|validate users, update passwords|roles.

/* Coder Note 
  *1* Start with the Database Schema: UserModel
    The UserModel is the foundation of the authentication system. 
    All authentication logic and middleware depend on the structure and data of the UserModel.
  *Logic:
    - Define fields like username, email, passwordHash, role
        and optionally, resetToken and tokenExpiry (for password resets).
    - Add methods like validatePassword() or hooks for password hashing.
    - Output: A schema that integrates with the database and supports authentication workflows.
*/
