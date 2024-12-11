import express from "express";
import ProfileController from "../controllers/ProfileController.js";

class ProfileRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    
    this.router.get("/profiles", (req, res) => 
        ProfileController.getAllProfiles(req, res));

    this.router.get("/profiles/:id", (req, res) => 
        ProfileController.getProfile(req, res));
    
    this.router.post("/profiles", (req, res) => 
        ProfileController.addProfile(req, res));

    this.router.put("/profiles/:id", (req, res) => 
        ProfileController.updateProfile(req, res));

    this.router.delete("/profiles/:id", (req, res) =>
         ProfileController.deleteProfile(req, res));
  }
}

export default new ProfileRoutes().router;
