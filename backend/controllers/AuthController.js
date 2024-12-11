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

import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserModel  from "../models/UserModel.js";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

// Environment Variables
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Includes logic for managing user authentication, including:
/* 1. Registering a new user:  Handles user registration with required fields validations & password security. */
export async function registerUser(req, res) {  // TODO Change name as register()
  try {
    const { email, password } = req.body;

    console.log("Incoming registration request:", { email, password });
    // Validates the required input fields
    if(!email || !password){
      console.log("Missing email or password.");
      return res.status(400).json({error: "Email and password are required."});
    }

    const versionToken = uuidv4();

    // TODO Email Verification on HOLD: Create the user with a 'verified' status set to false
    console.log("Creating new user...");
    // Duplicate email is checked in model.
    const newUser = await UserModel.createUser({
      email,
      password,
      versionToken,    // Override default: null
    });
    console.log("New user created:", {
      userId: newUser.userId,
      email: newUser.email,
      roles: newUser.roles,
    });

    // TODO Send verification email
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',               // Example using Gmail, is adjustable.
    //   auth:{
    //     user: process.env.EMAIL_USER, // Email address (must be set in .env)
    //     pass: process.env.EMAIL_PASS, // Email password (must be set in .env)
    //   },
    // });

    // const verificationLink = `${process.env.BASE_URL}/verify-email?token=${newUser.verificationToken}`;
    
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: newUser.email,
    //   subject: '><> Aquatica Registration',
    //   text: `Please verify your email by clicking on this link: ${verificationLink}`
    // };

    // await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "><> User registered successfully. <><",
      // TODO change after email verification
      // message: "><> User registered successfully. Please verify through email. <><",
      // token,
      user: { userId: newUser.userId, email: newUser.email
        // roles: "user",       // TODO if UserModel.isSeller() is not working
       },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

/* 2. Email verification: Verifies authentication tokens and save only verified user. */
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Verification token is required." });
    }
    // // Find the user with the provided token.
    // const user = await UserModel.getUserByVerificationToken(token); // TODO Implement getUserByVerificationToken() in UserModel
    // if (!user) {
    //   return res.status(404).json({ error: "Invalid or expired token." });
    // }

    // // Update the user's status to verified and clear the verification token
    // user.verified = true;
    // user.verificationToken = null;      // Remove the token after verification
    // await user.save();

    res.status(200).json({ message: " ><> Email verified successfully. <><" });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ error: "Internal server error."} );
  }
} 

/* 3. Log in a user: Verifies credentials, generates authentication tokens, and responds with user details.*/
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log("Incoming login request:", { email, password });
    // Validates the required input fields
    if (!email || !password) {
      console.log("Missing email or password.");
      return res.status(400).json({error: "Email and password are required."});
    }

    // Check if the email is verified
    // if(!user.verified){
    //   return res.status(403).json({message: "Please verify your email first."});
    // }

    console.log("Validating credentials...");
    // Queries the UserModel.js to validate email and password.
    const validCredentials = await UserModel.validateCredentials(email, password);
    console.log("Log in user:", validCredentials);
    // isValid = user, null;

    if (validCredentials === null) {
      console.log("Invalid email or password.");
      return res.status(401).json({ error: "Invalid email or password." });
    }

    console.log("Credential validated. Generating JWT now...");
    // Valid credentials: generates a JWT to authenticate the user for future requests.
    const tokenPayload = { 
      userId: validCredentials.userId, 
      tokenVersion: validCredentials.tokenVersion,
      roles: validCredentials.roles
    };
      // Sign JWT with tokenVersion for easy logout
    const token = jwt.sign(
      tokenPayload, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );
    console.log("JWT generated successfully:", token);

    res.status(200).json({
      message: " ><> Login successful. <><",
      token,
      userId: validCredentials.userId
    });
  } catch (error) {
    // Handles invalid login attempts with appropriate error messages.
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

/* 4. Log out a user: Invalidates tokens to ensure users can securely log out. */
export async function logout(req, res) {
  // TODO EXTRA: Involve token invalidation on multiple devices.
  try {
    const { userId } = req.user;
    console.log("Incoming logout request:", userId);

    // Find the user by id
    const user = await UserModel.getUserById(userId);
    console.log("Searching for user with Id...");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Invalid current token
    await UserModel.incrementTokenVersion(userId); 
    console.log("Token incremented.");

    res.status(200).json({ message: " ><> Logout successful. <><" });
  } catch (error) {
    // Handles invalid login attempts with appropriate error messages.
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

/* 5. Password reset: Allows user to reset password securely with a email verification. */
export async function requestPasswordReset(req, res)  {
  // Temporary reset token for email validation
  try {
    // Find the user by email
    const { email } = req.body;
    if (!email){
      console.log("Email is missing.");
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await UserModel.getUserByEmail(email);
    console.log("Finding user by email...");

    if (!user) {
      return res.status(404).json({ error: "User not found." })
    }

    console.log("Generating resetPassToken...");
    const resetPassToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 3600000);  // 1h
    await user.save();
    console.log("Reset Password Token generated");

    // Send reset email for verification
    const transporter = nodemailer.createTransport({
      service: "gmail",               // TODO Example using Gmail, is adjustable.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("Transporter created.");

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetPassToken}`;
    console.log("reset link created.");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "><> Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}. This link will expire in 1 hour.`,
    };
    console.log("Mail options created.");

    console.log("Sending email through transporter...");
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: " ><> Password reset email sent. <><" });
  } catch (error) {
    // Handles invalid login attempts with appropriate error messages.
    console.error("Error during password reset request:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function resetPassword(req, res) {
  try {
    // The user provides the old password and the new password.
    const { resetPassToken, newPassword } = req.body;
    console.log("Receiving password reset request:", { resetPassToken, newPassword });

    if (!resetPassToken || !newPassword) {
      console.log("Reset token or newPassword is missing.");     
      return res.status(400).json({ error: "Reset token and new password are required." });
    }

    console.log("Finding user by reset token...");     
    //Find the user with the provided token
    const user = await UserModel.getUserByResetPassToken(resetPassToken);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." })
    }

    console.log("Updating new password:", newPassword);     
    // Update the user's password and clear the reset token
    await UserModel.updatePassword(user.userId, newPassword);

    res.status(200).json({ message: "><> Password reset successful. <><" });
  } catch (error){
    console.error("Error during password reset:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

/* 6.  Become a seller: Requires authentication and sufficient permissions. */
export async function becomeSeller(req, res) {
  try {
    const { userId }  = req.user; 
    const { newRole } = req.body;

    // TODO Can delete if decided to update role rather than add on
    const validRoles = ["user", "seller"];
    if(!validRoles.includes(newRole)){
      return res.status(401).json({ error: "Invalid role." });
    }

    // Find the user
    const user = await UserModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update the user's role (as seller)
    user.roles = newRole;
    await user.save();

    res.status(200).json({ message: " ><> Hello, Seller <><", roles: user.roles });
  } catch (error){
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}


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