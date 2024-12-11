import { DataTypes } from "sequelize";
import sequelize from "../database.js";

// Define Profile model
const Profile = sequelize.define("Profile", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

// Define Address model
const Address = sequelize.define("Address", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  streetAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [5, 10],
    },
  },
});

// Define PaymentMethod model
const PaymentMethod = sequelize.define("PaymentMethod", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cardNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isCreditCard: true,
    },
  },
  expiryMonth: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [2, 2],
    },
  },
  expiryYear: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [2, 2],
    },
  },
  cvv: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [3, 4],
    },
  },
  cardName: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

// Define OrderHistory model
const OrderHistory = sequelize.define("OrderHistory", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false
  },
});

// Define associations
Profile.hasMany(Address, { foreignKey: "profileId", onDelete: "CASCADE" });
Address.belongsTo(Profile, { foreignKey: "profileId" });

Profile.hasMany(PaymentMethod, { foreignKey: "profileId", onDelete: "CASCADE" });
PaymentMethod.belongsTo(Profile, { foreignKey: "profileId" });

Profile.hasMany(OrderHistory, { foreignKey: "profileId", onDelete: "CASCADE" });
OrderHistory.belongsTo(Profile, { foreignKey: "profileId" });

/**
 * ProfileModel class to handle CRUD operations for Profile, Address, and PaymentMethod.
 */
class ProfileModel {
  /**
   * Initialize the database connection and synchronize models.
   */
  static async getProfileModel() {
    try {
      await sequelize.authenticate();
      await sequelize.sync(); // Changed from { force: true } to { force: false } to prevent data loss
      console.log("Database schema synchronized.");
    } catch (error) {
      console.error("Error synchronizing database schema:", error);
      throw error;
    }
  }

  /**
   * Create a new profile.
   * @param {Object} profile - Profile details.
   * @returns {Promise<Profile>} The created profile.
   */
  async addProfile(profile) {
    try {
      return await Profile.create(profile);
    } catch (error) {
      console.error("Error adding profile:", error);
      throw error;
    }
  }

  /**
   * Update an existing profile.
   * @param {UUID} profileId - The ID of the profile to update.
   * @param {Object} updates - The updates to apply.
   * @returns {Promise<Profile>} The updated profile.
   */
  async updateProfile(profileId, updates) {
    try {
      const profile = await Profile.findByPk(profileId);
      if (profile) {
        return await profile.update(updates);
      }
      throw new Error(`Profile with ID ${profileId} not found.`);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  /**
   * Delete a profile.
   * @param {UUID} profileId - The ID of the profile to delete.
   * @returns {Promise<Object>} Confirmation of deletion.
   */
  async deleteProfile(profileId) {
    try {
      const profile = await Profile.findByPk(profileId);
      if (profile) {
        await profile.destroy();
        return { success: true, message: `Profile with ID ${profileId} deleted.` };
      }
      throw new Error(`Profile with ID ${profileId} not found.`);
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw error;
    }
  }

  /**
   * Add a new address to a profile.
   * @param {UUID} profileId - The ID of the profile.
   * @param {Object} address - Address details.
   * @returns {Promise<Address>} The created address.
   */
  async addAddress(profileId, address) {
    try {
      const profile = await Profile.findByPk(profileId);
      if (profile) {
        return await Address.create({ ...address, profileId });
      }
      throw new Error(`Profile with ID ${profileId} not found.`);
    } catch (error) {
      console.error("Error adding address:", error);
      throw error;
    }
  }

  /**
   * Update an existing address.
   * @param {UUID} addressId - The ID of the address to update.
   * @param {Object} updates - The updates to apply.
   * @returns {Promise<Address>} The updated address.
   */
  async updateAddress(addressId, updates) {
    try {
      const address = await Address.findByPk(addressId);
      if (address) {
        return await address.update(updates);
      }
      throw new Error(`Address with ID ${addressId} not found.`);
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  }

  /**
   * Delete an address.
   * @param {UUID} addressId - The ID of the address to delete.
   * @returns {Promise<Object>} Confirmation of deletion.
   */
  async deleteAddress(addressId) {
    try {
      const address = await Address.findByPk(addressId);
      if (address) {
        await address.destroy();
        return { success: true, message: `Address with ID ${addressId} deleted.` };
      }
      throw new Error(`Address with ID ${addressId} not found.`);
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    }
  }

  /**
   * Add a new payment method to a profile.
   * @param {UUID} profileId - The ID of the profile.
   * @param {Object} paymentMethod - Payment method details.
   * @returns {Promise<PaymentMethod>} The created payment method.
   */
  async addPaymentMethod(profileId, paymentMethod) {
    try {
      const profile = await Profile.findByPk(profileId);
      if (profile) {
        return await PaymentMethod.create({ ...paymentMethod, profileId });
      }
      throw new Error(`Profile with ID ${profileId} not found.`);
    } catch (error) {
      console.error("Error adding payment method:", error);
      throw error;
    }
  }

  /**
   * Update an existing payment method.
   * @param {UUID} paymentMethodId - The ID of the payment method to update.
   * @param {Object} updates - The updates to apply.
   * @returns {Promise<PaymentMethod>} The updated payment method.
   */
  async updatePaymentMethod(paymentMethodId, updates) {
    try {
      const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);
      if (paymentMethod) {
        return await paymentMethod.update(updates);
      }
      throw new Error(`PaymentMethod with ID ${paymentMethodId} not found.`);
    } catch (error) {
      console.error("Error updating payment method:", error);
      throw error;
    }
  }

  /**
   * Delete a payment method.
   * @param {UUID} paymentMethodId - The ID of the payment method to delete.
   * @returns {Promise<Object>} Confirmation of deletion.
   */
  async deletePaymentMethod(paymentMethodId) {
    try {
      const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);
      if (paymentMethod) {
        await paymentMethod.destroy();
        return { success: true, message: `PaymentMethod with ID ${paymentMethodId} deleted.` };
      }
      throw new Error(`PaymentMethod with ID ${paymentMethodId} not found.`);
    } catch (error) {
      console.error("Error deleting payment method:", error);
      throw error;
    }
  }

  /**
   * Retrieve a profile along with its addresses, payment methods, and order history.
   * @param {UUID} profileId - The ID of the profile.
   * @returns {Promise<Profile>} The profile with associations.
   */
  async getProfile(profileId) {
    try {
      const profile = await Profile.findByPk(profileId, {
        include: [Address, PaymentMethod, OrderHistory],
      });
      if (profile) {
        return profile;
      }
      throw new Error(`Profile with ID ${profileId} not found.`);
    } catch (error) {
      console.error("Error retrieving profile:", error);
      throw error;
    }
  }
}

export default ProfileModel;
export { Profile, Address, PaymentMethod, OrderHistory };
