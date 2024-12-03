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
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

//TODO Use an env var in production.
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Includes logic for managing user authentication, including:
/* 1. Registering users: 
 *    Handles user registration with validations for required fields and password security. 
 */
export async function registerUser(req, res) {
  try{
    const { email, password} = req.body;

    // Validates the required input fields
    if(!email || !password){
      return res.status(400).json({error: "Email and password are required."});
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ where: {email} });
    if(existingUser) {
      return res.status(409).json({error: "Email is already in use."})
    }

    // Hashes the password using bcrypt before storing it in the database.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with a 'verified' status set to false
    const newUser = await User.create({
      email,
      hashedPassword,
      roles: ["user"],                // set default role as `user`
      verificationToken: uuidv4(),    // TODO Generate a verification token
    });

    //Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',               // Example using Gmail, is adjustable.
      auth:{
        user: process.env.EMAIL_USER, // Email address (must be set in .env)
        pass: process.env.EMAIL_PASS, // Email password (must be set in .env)
      },
    });

    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${newUser.verificationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: '><> Aquatica Registration',
      text: `Please verify your email by clicking on this link: ${verificationLink}`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "><> User registered successfully. Please check your email to verify your account. <><",
      token,
      user: {userId: newUser.userId, email: newUser.email},
    });
  } catch (error){
    console.error("Error during registration:", error);
    res.status(500).json({error: "Internal server error."});
  }
}

/* 2. Email verification: 
 *    Verifies authentication tokens and save only verified user. 
 */
export async function verifyEmail(req, res) {
  try{
    const { token } = req.query;

    if(!token){
      return res.status(400).json({error: "Verification token is required."});
    }
    // Find the user with the provided token.
    const user = await User.findOne({ where: {verificationToken: token} });
    if(!user) {
      return res.status(404).json({error: "Invalid or expired token."});
    }

    // Update the user's status to verified and clear the verification token
    user.verified = true;
    user.verificationToken = null;      // Remove the token after verification
    await user.save();

    res.status(200).json({ message: " ><> Email verified successfully <><" });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({error: "Internal server error."});
  }
}

/* 3. Logging in users: 
 *    Verifies credentials, generates authentication tokens, and responds with user details. 
 */
export async function login(req, res) {
  try{
    const {email, password} = req.body;
    
    // Validates the required input fields
    if(!email || !password){
      return res.status(400).json({error: "Email and password are required."});
    }

    // Queries the UserModel.js to find the user by email.
    const user = await User.findOne({ where: {email} });
    if(!user) {
      return res.status(401).json({error: "Invalid email."});
    }

    // Check if the email is verified
    if(!user.verified){
      return res.status(403).json({message: "Please verify your email first."});
    }

    // Compares the hashed password stored in the database with the one entered by the user.
    const validPassword = await bcrypt.compare(password, user.hashedPassword);
    if(!validPassword){
      return res.status(401).json({error: "Invalid email or password."});
    }

    // Valid credentials: generates a JWT to authenticate the user for future requests.
    const token = jwt.sign(
      { userId: user.userId, roles: user.roles },
      JWT_SECRET,
      { expiresIn: "1h"}
    );

    user.currentToken = token;
    await user.save();

    res.status(200).json({
      message: " ><> User login successfully <><",
      token,
    });
  } catch (error) {
    // Handles invalid login attempts with appropriate error messages.
    console.error("Error during login:", error);
    res.status(500).json({error: "Internal server error."});
  }
}

/* 4. Logging out users: 
 *    Invalidates tokens to ensure users can securely log out.
 */
export async function logout(req, res) {
  // TODO EXTRA: Involve token invalidation on multiple devices.
  try{
    const { userId } = req.user;

    // Find the user and clear the currentToken
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    // Invalid current token
    await UserModel.incrementTokenVersion(userId); 

    res.status(200).json({ message: " ><> User logout successfully <><" });
  } catch (error) {
    // Handles invalid login attempts with appropriate error messages.
    console.error("Error during logout:", error);
    res.status(500).json({error: "Internal server error."});
  }
}

/* 5. Resetting Password: 
 *    Allows users to reset their password securely with a email verification.
 */
export async function requestPasswordReset(req, res)  {
  // Temporary reset token for email validation
  try{
    // Find the user by email
    const { email } = req.body;
    if(!email){
      return res.status(400).json({error: 'Email is required.'});
    }

    const user = await User.findOne({ where: {email} });
    if(!user) {
      return res.status(404).json({error: `User not found.`})
    }

    // TODO Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 3600000;          // 1h
    await user.save();

    // Send reset email for verification
    const transporter = nodemailer.createTransport({
      service: 'gmail',               // TODO Example using Gmail, is adjustable.
      auth:{
        user: process.env.EMAIL_USER, //  Email address (must be set in .env)
        pass: process.env.EMAIL_PASS, //  Email password (must be set in .env)
      },
    });

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '><> Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password at Aquatica: ${resetLink}. This link will expire in 1 hour.`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: " ><> Password reset email sent successfully <><" });
  } catch (error) {
    // Handles invalid login attempts with appropriate error messages.
    console.error("Error during password reset request:", error);
    res.status(500).json({error: "Internal server error."});
  }
}

// TODO Consider Instead of email: The AuthController verifies the old password and update the new.
export async function resetPassword(req, res) {
  try{
    // The user provides the old password and the new password.
    const { token, newPassword} = req.body;

    if(!token || !newPassword){
      return res.status(400).json({error: "Token and new password are required."});
    }

    //Find the user with the provided token
    const user = await User.findOne({ 
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {[sequelize.Op.gt]: new Date()},  // Ensure the token is not expired
      },
    });
    
    if(!user) {
      return res.status(400).json({error: "Invalid or expired token."})
    }

    // Hash the new password.
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    user.hashedPassword = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "><> Password reset successfully <><" });
  } catch (error){
    console.error("Error during registration:", error);
    res.status(500).json({error: "Internal server error."});
  }
}

// TODO Validates the new role: Replace || Add ?
/* 6.  Updating user Role as seller:
 *    Requires authentication and sufficient permissions.
 */
export async function becomeSeller(req, res) {
  try{
    const { userId }  = req.user; 
    const { newRole } = req.body;

    const validRoles = ["user", "seller"];
    if(!validRoles.includes(newRole)){
      return res.status(401).json({error: 'Invalid role.'});
    }

    // Find the user
    const user = await User.findByPk(userId);
    if(!user) {
      return res.status(404).json({error: `User not found.`})
    }

    // Update the user's role (as seller)
    user.roles = [newRole];
    await user.save();

    res.status(200).json({message: " ><> Hello, Seller <><", roles: user.roles});
  } catch (error){
    console.error("Error updating role:", error);
    res.status(500).json({error: "Internal server error."});
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