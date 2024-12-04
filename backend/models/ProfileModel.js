import { DataTypes } from "sequelize";
import sequelize from "../database.js";

// Define model
const Profile = sequelize.define("Profile", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  paymentMethod: { type: DataTypes.STRING, allowNull: true },
});

const OrderHistory = sequelize.define("OrderHistory", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  profileId: { type: DataTypes.UUID, allowNull: false }, 
  orderDate: { type: DataTypes.DATE, allowNull: false },
  total: { type: DataTypes.FLOAT, allowNull: false },
  items: { type: DataTypes.JSONB, allowNull: false }, 
});

// Define associations
Profile.hasMany(OrderHistory, { foreignKey: "profileId", onDelete: "CASCADE" });
OrderHistory.belongsTo(Profile, { foreignKey: "profileId" });

class ProfileModel {
  static async getProfileModel() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        console.log("Database schema synchronized.");
      } catch (error) {
        console.error("Error synchronizing database schema:", error);
        throw error;
      }
  }

  async addProfile(profile) {
    try{
        return await Profile.create(profile);
    } catch (error){
        console.error("Error adding profile:", error);
        throw error;
    }
  }

  async updateProfile(profileId, updates) {
    const profile = await Profile.findByPk(profileId);
    if (profile) {
      return await profile.update(updates);
    }
    throw new Error(`Profile with ID ${profileId} not found.`);
  }

  
  async deleteProfile(profileId) {
    const profile = await Profile.findByPk(profileId);
    if (profile) {
      await profile.destroy();
      return { success: true, message: `Profile with ID ${profileId} deleted.` };
    }
    throw new Error(`Profile with ID ${profileId} not found.`);
  }

}

export default ProfileModel;
export {Profile, OrderHistory};
