import ProfileModel, { Profile, OrderHistory } from "../models/ProfileModel.js";
class ProfileController{
    constructor(){
        this.model = new ProfileModel();
    }

    async getProfile(req, res){
        try {
            const { id } = req.params;
            const profile = await Profile.findByPk(id, { include: [OrderHistory] });
      
            if (!profile) {
              return res.status(404).json({ error: "Profile not found" });
            }
      
            res.status(200).json(profile);
          } catch (error) {
            console.error("Error retrieving profile:", error);
            res.status(500).json({ error: "Failed to retrieve profile" });
        }
    }

    async addProfile(req, res) {
        try {
          const { name, phone, email, avatar, address, paymentMethod } = req.body;
    
          // Validate input
          if (!name || !email) {
            return res.status(400).json({ error: "Missing required fields: name or email" });
          }
    
          const newProfile = await Profile.create({
            name,
            phone,
            email,
            avatar,
            address,
            paymentMethod,
          });
    
          res.status(201).json(newProfile);
        } catch (error) {
          console.error("Error adding profile:", error);
          res.status(500).json({ error: "Failed to add profile" });
        }
    }

    async updateProfile(req, res) {
        try {
          const { id } = req.params;
          const { name, phone, email, avatar, address, paymentMethod } = req.body;
    
          // Find the profile by ID
          const profileToUpdate = await Profile.findByPk(id);
          if (!profileToUpdate) {
            return res.status(404).json({ error: "Profile not found" });
          }
    
          await profileToUpdate.update({
            name,
            phone,
            email,
            avatar,
            address,
            paymentMethod,
          });
    
          //Add order history if provided
          if (orderHistory && Array.isArray(orderHistory)) {
            // Delete old order history
            await OrderHistory.destroy({ where: { profileId: id } });
      
            const orderPromises = orderHistory.map((order) =>
              OrderHistory.create({
                profileId: id,
                orderDate: order.orderDate,
                total: order.total,
                items: order.items,
              })
            );
            await Promise.all(orderPromises);
          }
      
          const updatedProfile = await Profile.findByPk(id, { include: [OrderHistory] });
      
          res.status(200).json({ status: "Profile updated successfully", profile: profileToUpdate });
        } catch (error) {
          console.error("Error updating profile:", error);
          res.status(500).json({ error: "Failed to update profile" });
        }
    }

    async deleteProfile(req, res) {
        try {
          const { id } = req.params;
    
          const profileToDelete = await Profile.findByPk(id);
          if (!profileToDelete) {
            return res.status(404).json({ error: "Profile not found" });
          }
    
          await OrderHistory.destroy({ where: { profileId: id } });
    
          await profileToDelete.destroy();
    
          res.status(200).json({ status: "Profile deleted successfully" });
        } catch (error) {
          console.error("Error deleting profile:", error);
          res.status(500).json({ error: "Failed to delete profile" });
        }
    }

    async getOrderHistory(req, res) {
        try {
          const { profileId } = req.params;
    
          const orders = await OrderHistory.findAll({ where: { profileId } });
          if (!orders.length) {
            return res.status(404).json({ error: "No orders found for this profile" });
          }
    
          res.status(200).json(orders);
        } catch (error) {
          console.error("Error retrieving order history:", error);
          res.status(500).json({ error: "Failed to retrieve order history" });
        }
      }
}