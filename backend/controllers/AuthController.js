import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { UserModel } from "../models/UserModel.js";
import { v4 as uuidv4 } from "uuid";

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Register a new user
export async function registerUser(req, res) {
  try {
    const { email, password } = req.body;

    console.log("Incoming registration request:", { email, password });

    if (!email || !password) {
      console.log("Missing email or password.");
      return res.status(400).json({ error: "Email and password are required." });
    }

    console.log("Checking for existing user...");
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      console.log(`User with email ${email} already exists.`);
      return res.status(409).json({ error: "Email is already in use." });
    }

    console.log("Creating new user...");
    const newUser = await UserModel.createUser({ email, password });

    console.log("New user created:", {
      userId: newUser.userId,
      email: newUser.email,
      roles: newUser.roles,
    });

    res.status(201).json({
      message: "User registered successfully.",
      userId: newUser.userId,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}


// Verify email 
/*
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Verification token is required." });
    }

    const user = await UserModel.findByVerificationToken(token);
    if (!user) {
      return res.status(404).json({ error: "Invalid or expired token." });
    }

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
*/

// Log in a user
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    console.log("Incoming login request:", { email, password });

    if (!email || !password) {
      console.log("Missing email or password.");
      return res.status(400).json({ error: "Email and password are required." });
    }

    console.log("Searching for user with email:", email);
    const user = await UserModel.findByEmail(email);

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(401).json({ error: "Invalid email or password." });
    }

    console.log("User found:", {
      userId: user.userId,
      email: user.email,
      roles: user.roles,
    });

    console.log("Comparing provided password...");
    const validPassword = await bcrypt.compare(password, user.hashedPassword);

    console.log("Password comparison result:", validPassword);

    if (!validPassword) {
      console.log("Password comparison failed for email:", email);
      return res.status(401).json({ error: "Invalid email or password." });
    }

    console.log("Password matched. Generating JWT...");
    const token = jwt.sign(
      { userId: user.userId, roles: user.roles },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("JWT generated successfully:", token);

    res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}



// Log out a user
export async function logout(req, res) {
  try {
    const { userId } = req.user;

    const user = await UserModel.incrementTokenVersion(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Request password reset
export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpired = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}. The link will expire in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Error during password reset request:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Reset password
export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required." });
    }

    const user = await UserModel.findByResetToken(token);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    await UserModel.updatePassword(user.userId, newPassword);

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Become a seller
export async function becomeSeller(req, res) {
  try {
    const { userId } = req.user;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.roles = ["seller"];
    await user.save();

    res.status(200).json({ message: "Role updated to seller." });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

