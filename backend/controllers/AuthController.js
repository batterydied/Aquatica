// AuthController: Haiyi
// **Description**: Implement the logic for user authentication, handling:
  // login, registration, password reset, and logout operations. It will also handle errors 
  // related to: Invalid credentials, Missing fields, Failed login attempts.
// **Tag**: #67
// **Owner**: Haiyi
// **Expected Outcome**: A controller that manages authentication logic, including: 
  // verifying user credentials, generating tokens, and managing user sessions.

/* Interface with UserModel.js to manage authentication data in the database.
  - Validate Credentials
  - Hash Passwords for secure storage
  - Manage Tokens for user sessions. 
*/

// Includes logic for managing user authentication, including:
/* 1. Registering users: Handles user registration with validations for required fields and password security.
  - Validates the input fields (e.g., email format, password length).
  - Hashes the password using bcrypt before storing it in the database.
  - Stores the new user's details in the database (using **_UserModel.js_**).
  - Generates a token or session to authorize the user for subsequent requests.
*/

/* 2. Logging in users: Verifies credentials, generates authentication tokens, and responds with user details.
  - Queries the _**UserModel.js**_ to find the user by email.
  - Compares the hashed password stored in the database with the one entered by the user.
  - If the credentials are valid, generates a JWT to authenticate the user for future requests.
  - Handles invalid login attempts with appropriate error messages.
*/

/* 3. Logging out users**: Invalidates tokens to ensure users can securely log out.
  - Invalidates the user’s authentication token, effectively logging the user out.
  - **_Maybe_** involve token invalidation on multiple devices, if required.
  - On client-side logout, it may involve clearing tokens or session data.
*/

/* 4. Resetting Password**: Allows users to reset their password securely.
  - The user provides the old password and the new password.
  - The AuthController verifies the old password by checking it against the one stored in UserModel
  - If the old password is correct, the new password is hashed and saved in the database.
*/

/* Coder Note 
  *3* Build the Backend Logic: AuthController
    The AuthController handles the core business logic for authentication, like 
    registering users, logging in, logging out, and password resets.
  *Logic:
  - Routes will call this controller to execute the actual logic for each operation.
  - Includes steps like hashing passwords during registration, generating tokens for login, 
  and validating tokens for password reset.
  - Dependencies: The AuthController uses the UserModel for database interactions and authentication logic.
*/

