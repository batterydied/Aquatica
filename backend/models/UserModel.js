// UserModel : Haiyi
// **Description**:  Design the `UserModel` in Sequelize, integrated with `database.sqlite` for user management.
    // attributes: userId, email, hashedPassword, roles, & timestamps (createdAt, updatedAt). 
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
  *- Password Reset.js:  For managing password recovery and secure updates.
*/

import sequelize from '../database.js';
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

// Define the User model. Design the database schema for user management:
  // *1 {Fields} userId, email, hashedPassword, roles, +_timestamps_+.
const User = sequelize.define("User", {
  userId: {                         // Universal Unique ID
    type: DataTypes.UUID,           
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,                   // Required field: unique email
    validate:{ 
      isEmail: {
        msg: "Email address must be valid."
      },  
      notEmpty: {
        msg: "Email field cannot be empty."
      } 
    }
  },
  hashedPassword: {
    type: DataTypes.STRING,
    allowNull: false,               // Required field: password
    validate:{
      notEmpty: {
        msg: "Password field cannot be empty."
      },
      len: {
        args: [8,30],
        msg: "Password must be between 8 and 30 characters long."
      }
    }
  },
  roles: {
    type: DataTypes.ENUM("user", "seller"),
    allowNull: false,               // At least 1 role is required
    defaultValue: "user",           // Default role is 'user' once registered
    validate:{
      isIn:{
        arg: [["user", "seller"]],  // Only `user` or `seller` are valid roles.
        msg: "Role must be one of: 'user', 'seller', or both.",
      }
    },
  },   
}, {
  tableName: "users",
  timestamps: true,                 // TODO save or delete timestamps?  
  hooks: {                          // Always hash password before saving
    beforeCreate: async (user) => {
      user.hashedPassword = await bcrypt.hash(user.hashedPassword, 10);
    },
    beforeUpdate: async (user) => {
      if(user.changed("hashedPassword")){
        user.hashedPassword = await bcrypt.hash(user.hashedPassword, 10);
      }
    },
  },
});

  // *2 {Methods} createUser, getUserByEmail, updatePassword, and validateCredentials.
class _UserModel {
  constructor() {
    this.model = User;
  }

  /**
   * Initializes the database and syncs the model.
   */
  async init() {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      console.log("Database synced successfully.");
    } catch (error) {
      console.error("Database initialization failed:", error);
      throw error;
    }
  }

  /**
   * Create a new user with validations and password hashing.
   * @param {Object} userData - { email, password, roles }
   * @returns {Object} - Created user.
   */
  async createUser(userData) {
    try{
      const {email, password, roles} = userData;
      // Check for duplicate email
      const unique = await this.model.findOne({ where: { email } });
      if (unique) {
        throw new Error("A user with this email already exists.");
      }

      return await this.model.create(userData);
    }catch (error){
      console.error("Error creating user:", error);
      throw error;
    } 
  }

  /**
   * Retrieve a user by ID.
   * @param {string} userId - User ID.
   * @returns {Object|null} User object or null if not found.
   */
  async getUserById(userId) {
    try {
      return await this.model.findByPk(userId);
    } catch (error) {
      console.error("Error retrieving user by ID:", error);
      throw error;
    }
  }

  /**
   * Retrieve a user by email.
   * @param {string} email - User email.
   * @returns {Object|null} User object or null if not found.
   */
  async getUserByEmail(email) {
    try {
        return await this.model.findOne({ where: {email} }); // Find a user with the specified email
    } catch (error) {
      console.error("Error retrieving user by email:", error);
      throw error;
    }
  }
  
  async validateCredentials(email, passwordHash) {
    try {
      const user = await this.getUserByEmail(email);  // Retrieve the user by email
      if (!user) return null;                         // Return null if the user isn't found
      return user.hashedPassword === passwordHash ? user: null; // Return null if the password isn't right
    } catch (error) {
      console.error("Error validating credentials:", error);
      throw error;
    }
  }

  /**
   * Check if a user has a specific role.
   * @param {Object} user - User object.
   * @returns {boolean} True if the user has the role as seller, false otherwise.
   */
  isSeller(user) {
    return user.roles === "seller" ;
  }

  async updatePassword(userId, newPassword) {
    try {
      const user = await this.model.findByPk(userId); // Find the user by ID
      if (!user) {throw new Error("User not found");}
      user.hashedPassword = newPassword; // New password should already be hashed before set.
      await user.save();
      return user;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }

  /**
   * Update a user's information.
   * @param {string} userId - User ID.
   * @param {Object} updates - Data to update.
   * @returns {Object} Updated user.
   */
  async updateUser(userId, updates) {
    try {
      const user = await this.model.findByPk(userId);
      if (!user) throw new Error("User not found");
      await user.update(updates);
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  //TODO DELETE/ MORE functions
}

const UserModel = new _UserModel();
export default UserModel;
export { User };


/* Coder Note 
  *1* Start with the Database Schema: UserModel
    The UserModel is the foundation of the authentication system. 
    All authentication logic and middleware depend on the structure and data of the UserModel.
  *Logic:
    - Define fields like username, email, passwordHash, role, and timestamps.
    - Add methods like validatePassword() or hooks for password hashing.
    - Output: A schema that integrates with the database and supports authentication workflows.
*/