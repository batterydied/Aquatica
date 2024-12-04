import sequelize from '../database.js';
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';


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
      isEmail:  { msg: "Please provide a valid email." },  
      notEmpty: { msg: "Email cannot be empty." } 
    },
  },
  hashedPassword: {
    type: DataTypes.STRING,
    allowNull: false,               // Required field: password
    validate:{
      notEmpty: { msg: "Password field cannot be empty." },
      len: { args: [8,100], msg: "Password must be at least 8 characters long." }
    },
  },
  roles: {                          // To Filter seller: SELECT * FROM Users WHERE roles @> '"seller"';
    type: DataTypes.JSONB,          // Added flexibility: multi-roles, permission allowed for fix
    defaultValue: "user",           // Default role is 'user' once registered
  },    
  // verified: {
  //   type: DataTypes.BOOLEAN,
  //   defaultValue: false,            // TODO User need to get verified by email after using email verification for register/login
  // },
  // verificationToken: {
  //   type: DataTypes.STRING,
  //   allowNull: true,                //  Token will be generated only
  // }, 
  resetPasswordToken:{
    type: DataTypes.STRING,
    allowNull: true, 
  }, 
  resetPasswordExpired:{
    type: DataTypes.DATE,
    allowNull: true, 
  }, 
  tokenVersion:{
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: "users",               // Define the table name as "users"
  timestamps: true,                 // Enable automatic timestamp columns (createdAt, updatedAt) 
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

class _UserModel {      
  constructor() {
    this.model = User;
  }

  /** Initializes the database and syncs the model. */
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

  /**  Create a new user with validations and password hashing.
   * @param {Object} userData - { email, password, roles }
   * @returns {Object} - Created user.
   */
  async createUser(userData) {    // TODO with Controller.register()
    try{
      const { email, password, roles = "user" } = userData; // TODO Destructure outside try{}?
        // , verified = false, verificationToken = null  // TODO after email verification

      // Check for duplicate email
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        throw new Error("A user with this email already exists.");
      }

      const newUser = await this.model.create({
        email,
        hashedPassword: password,   // Pass raw password for hook to hash before saving
        roles,
        // verified   // TODO After Email Verification
        // verificationToken,
      });
      return newUser;
    }catch (error){
      console.error("Error creating user:", error);
      throw error;
    } 
  }

  /** Retrieve a user by ID.
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

  /** Retrieve a user by email.
   * @param {string} email - User email.
   * @returns {Object|null} User object or null if not found.
   */
  async getUserByEmail(email) {
    try {
        return await this.model.findOne({ where: { email } }); // Find a user with the specified email
    } catch (error) {
      console.error("Error retrieving user by email:", error);
      throw error;
    }
  }
  
   /** Retrieve a user by resetToken.
   * @param {string} resetToken - resetToken sent to email for password reset.
   * @returns {Object|null} User object or null if not found.
   */
   async getUserByResetPassToken(resetPassToken) {
    try {
        return await this.model.findOne({ where: { resetPassToken } }); // Find a user with the specified email
    } catch (error) {
      console.error("Error retrieving user by email:", error);
      throw error;
    }
  }
  
  /** Validate credentials when logging in: email and password */
  async validateCredentials(email, password) { 
    try {
      const user = await this.getUserByEmail(email);  // Retrieve the user by email
      if (!user) return null;                         // Return null if the user isn't found
      const isValid = await bcrypt.compare(password, user.hashedPassword);
      return isValid ? user: null;                    // Return null if the password isn't right
    } catch (error) {
      console.error("Error validating credentials:", error);
      throw error;
    }
  }
  
  /** Increment the token version when logging out*/ 
async incrementTokenVersion(userId) {
  try {
    const user = await this.getUserById(userId);
    if (!user) throw new Error("User not found");

    user.tokenVersion += 1;
    await user.save();
    return user;
  } catch (error) {
    console.error("Error incrementing token version:", error);
    throw error;
  }
}

/** Validate token against the stored token version for logout. */ 
async validateTokenVersion(userId, tokenVersion) {
  try {
    const user = await this.getUserById(userId);
    if (!user) throw new Error("User not found");
    return user.tokenVersion === tokenVersion;  // Check if the token version matches
  } catch (error) {
    console.error("Error validating token version:", error);
    throw error;
  }
}

async updatePassword(userId, newPassword) {
  try {
    const user = await this.getUserById(userId); // Find the user by ID
    if (!user) throw new Error("User not found");

    user.hashedPassword = newPassword; // Hook will rehash the new password before update.
    await user.save();
    return user;
  } catch (error) {
      console.error("Error updating password:", error);
      throw error;
  }
}

  /** Update a user's information.
   * @param {string} userId - User ID.
   * @param {Object} updates - Data to update.
   * @returns {Object} Updated user.
   */
  async updateUser(userId, updates) { // TODO check user data
    try {
      const user = await this.getUserById(userId);
      if (!user) throw new Error("User not found");
      await user.update(updates);
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  /** Check if a user has a specific role.
   * @param {Object} user - User object.
   * @returns {boolean} True if the user has the role as seller, false otherwise.
   */ 
  isSeller(user) {
    return user.roles === "seller" ;
  }
}

const UserModel = new _UserModel();
export default UserModel;
export { User };