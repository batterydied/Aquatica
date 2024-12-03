// AuthController: Haiyi
// **Description**: Implement the logic for user authentication, handling:
  // login, registration, password reset, and logout operations. It will also handle 
  // errorsrelated to: Invalid credentials, Missing fields, Failed login attempts.
// **Tag**: #67
// **Owner**: Haiyi
// **Expected Outcome**: A controller that manages authentication logic, including: 
  // verifying user credentials, generating tokens, and managing user sessions.

/* Interface with UserModel.js to manage authentication data in the database.
  - Validate Credentials
  - Hash Passwords for secure storage
  - Manage Tokens for user sessions. 
*/
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../models/UserModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use an env var in production.
const JWT_EXPIRES_IN = "1h";  // Token expiration

// Includes logic for managing user authentication, including:
/* 1. Registering users: Handles user registration with validations for required fields and password security. */
export async function registerUser(req, res) {
  try{
    const { email, password} = req.body;

    // Validates the required input fields
    if(!email || !password){
      return res.status(400).json({error: 'Email and password are required'});
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ where: {email} });
    if(existingUser) {
      return res.status(409).json({error: `Email is already in use.`})
    }

    // Create the user: Hashes the password using bcrypt before storing it in the database.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Stores the new user's details in the database (using `UserModel.js`).
    const newUser = await User.create({
      email,
      hashedPassword,
      roles: ["user"],  // set default role as `user`
    });

    // Generates a token or session to authorize the user for subsequent requests.
    const token = jwt.sign(
      { userId: newUser.userId, roles: newUser.roles },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN}
    );

    res.status(201).json({
      message: " ><> User registered successfully <><",
      userId: newUser.userId,
      token,
    });
  } catch (error){
    console.error("Error during registration:", error);
    res.status(500).json({error: "Internal server error."});
  }
}
/* 2. Logging in users: Verifies credentials, generates authentication tokens, and responds with user details.
  - Queries the _**UserModel.js**_ to find the user by email.
  - Compares the hashed password stored in the database with the one entered by the user.
  - If the credentials are valid, generates a JWT to authenticate the user for future requests.
  - Handles invalid login attempts with appropriate error messages.
*/
async function login(params) {
  
}

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

