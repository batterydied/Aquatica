import ProfileModel, { Profile, Address, PaymentMethod, OrderHistory } from "../models/ProfileModel.js";

class ProfileController {
    constructor() {
        this.model = new ProfileModel();
    }

    /**
     * Retrieve a profile by ID, including associated addresses, payment methods, and order history.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getProfile(req, res) {
        try {
            const { id } = req.params;
            const profile = await this.model.getProfile(id);

            if (!profile) {
                return res.status(404).json({ error: "Profile not found" });
            }

            res.status(200).json(profile);
        } catch (error) {
            console.error("Error retrieving profile:", error);
            res.status(500).json({ error: "Failed to retrieve profile" });
        }
    }

    /**
     * Create a new profile along with optional addresses and payment methods.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async addProfile(req, res) {
        try {
            const { name, phone, email, avatar, addresses, paymentMethods } = req.body;

            // Validate required fields
            if (!name || !email) {
                return res.status(400).json({ error: "Missing required fields: name or email" });
            }

            // Add the profile
            const newProfile = await this.model.addProfile({
                name,
                phone,
                email,
                avatar,
            });

            // Add addresses if provided
            if (Array.isArray(addresses)) {
                for (const address of addresses) {
                    await this.model.addAddress(newProfile.id, address);
                }
            }

            // Add payment methods if provided
            if (Array.isArray(paymentMethods)) {
                for (const paymentMethod of paymentMethods) {
                    await this.model.addPaymentMethod(newProfile.id, paymentMethod);
                }
            }

            // Retrieve the full profile with associations
            const fullProfile = await this.model.getProfile(newProfile.id);

            res.status(201).json(fullProfile);
        } catch (error) {
            console.error("Error adding profile:", error);
            res.status(500).json({ error: "Failed to add profile" });
        }
    }

    /**
     * Update an existing profile, including its addresses and payment methods.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async updateProfile(req, res) {
        try {
            const { id } = req.params;
            const { name, phone, email, avatar, addresses, paymentMethods, orderHistory } = req.body;

            // Update profile information
            const updatedProfile = await this.model.updateProfile(id, {
                name,
                phone,
                email,
                avatar,
            });

            // Update addresses if provided
            if (Array.isArray(addresses)) {
                // For simplicity, delete existing addresses and add the new ones
                // Alternatively, handle partial updates based on address IDs
                await this.model.deleteAddressesByProfileId(id);
                for (const address of addresses) {
                    await this.model.addAddress(id, address);
                }
            }

            // Update payment methods if provided
            if (Array.isArray(paymentMethods)) {
                // For simplicity, delete existing payment methods and add the new ones
                // Alternatively, handle partial updates based on payment method IDs
                await this.model.deletePaymentMethodsByProfileId(id);
                for (const paymentMethod of paymentMethods) {
                    await this.model.addPaymentMethod(id, paymentMethod);
                }
            }

            // Update order history if provided
            if (Array.isArray(orderHistory)) {
                // Delete old order history and add new ones
                await this.model.deleteOrderHistoryByProfileId(id);
                for (const order of orderHistory) {
                    await this.model.addOrderHistory(id, order);
                }
            }

            // Retrieve the full profile with associations
            const fullProfile = await this.model.getProfile(id);

            res.status(200).json({ status: "Profile updated successfully", profile: fullProfile });
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ error: "Failed to update profile" });
        }
    }

    /**
     * Delete a profile by ID, including all associated addresses, payment methods, and order histories.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async deleteProfile(req, res) {
        try {
            const { id } = req.params;

            // Delete the profile along with all associated data
            await this.model.deleteProfile(id);

            res.status(200).json({ status: "Profile deleted successfully" });
        } catch (error) {
            console.error("Error deleting profile:", error);
            res.status(500).json({ error: "Failed to delete profile" });
        }
    }

    /**
     * Retrieve the order history for a specific profile.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getOrderHistory(req, res) {
        try {
            const { profileId } = req.params;

            const profile = await this.model.getProfile(profileId);
            if (!profile || !profile.OrderHistories || profile.OrderHistories.length === 0) {
                return res.status(404).json({ error: "No orders found for this profile" });
            }

            res.status(200).json(profile.OrderHistories);
        } catch (error) {
            console.error("Error retrieving order history:", error);
            res.status(500).json({ error: "Failed to retrieve order history" });
        }
    }
}

export default ProfileController;
