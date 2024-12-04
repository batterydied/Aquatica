import sequelize from '../database.js';
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

// Define the User model. Design the database schema for user management:
const User = sequelize.define("User", {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "Please provide a valid email." },
      notEmpty: { msg: "Email cannot be empty." },
    },
  },
  hashedPassword: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Password field cannot be empty." },
      len: { args: [8, 100], msg: "Password must be at least 8 characters long." },
    },
  },
  roles: {
    type: DataTypes.JSONB,
    defaultValue: ["user"],
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpired: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tokenVersion: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: "users",
  timestamps: true,
});


export default User;

/**
 * Encapsulated class for User-related database operations.
 */
class UserModel {
  /**
   * Find a user by email.
   * @param {string} email - The email to search for.
   * @returns {Promise<User|null>}
   */
  static async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  /**
   * Create a new user.
   * @param {object} userData - The user data (email, password, etc.).
   * @returns {Promise<User>}
   */
  static async createUser(userData) {
    const { email, password } = userData;

    console.log("UserModel.createUser: Checking if user already exists for email:", email);
    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      console.log("UserModel.createUser: User already exists with email:", email);
      throw new Error("User with this email already exists.");
    }

    console.log("UserModel.createUser: Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("UserModel.createUser: Hashed password generated.");

    const newUser = await User.create({
      email,
      hashedPassword,
      roles: ["user"],
      verificationToken: null,
    });

    console.log("UserModel.createUser: New user created:", newUser.toJSON());
    return newUser;
  }

  /**
   * Validate a user's credentials.
   * @param {string} email - The user's email.
   * @param {string} password - The user's plain password.
   * @returns {Promise<User|null>}
   */
  static async validateCredentials(email, password) {
    const user = await UserModel.findByEmail(email);

    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    return isValidPassword ? user : null;
  }

  /**
   * Find a user by their reset password token.
   * @param {string} token - The reset token.
   * @returns {Promise<User|null>}
   */
  static async findByResetToken(token) {
    return await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpired: { [sequelize.Op.gt]: new Date() }, // Check token expiration
      },
    });
  }

  /**
   * Increment the token version (used for invalidating sessions).
   * @param {string} userId - The user ID.
   * @returns {Promise<User>}
   */
  static async incrementTokenVersion(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    user.tokenVersion += 1;
    await user.save();

    return user;
  }

  /**
   * Update a user's password.
   * @param {string} userId - The user ID.
   * @param {string} newPassword - The new plain password.
   * @returns {Promise<User>}
   */
  static async updatePassword(userId, newPassword) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    user.hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.save();

    return user;
  }
}

export { UserModel };

