/**
 * The become seller page allows a user to become a seller if they are not already.
 */

import { BaseComponent } from "../../app/BaseComponent.js";
import { authService } from "../../services/AuthService.js";
import { AppController } from "../../app/AppController.js";

export class BecomeSellerPage extends BaseComponent {
    constructor() {
        super();
        this.loadCSS("BecomeSellerPage");
    }

    render() {
        // empty container
        this.container.innerHTML = "";
        this.container.classList.add("become-seller-page");

        const notSellerYet = document.createElement("h1");
        notSellerYet.innerText = "You are not currently a seller. Would you like to sign up to sell your own items?";
        this.container.appendChild(notSellerYet);

        const becomeSellerButton = document.createElement("button");
        becomeSellerButton.classList.add("become-seller-button");
        becomeSellerButton.innerText = "Become a seller now!";
        becomeSellerButton.addEventListener("click", () => this.becomeSeller());
        this.container.appendChild(becomeSellerButton);

        return this.container;
    }

    becomeSeller() {
        try {
            authService.becomeSeller();
        } catch (error) {
            console.log("Error becoming seller: " + error);
            alert("Failed to enroll as seller. Please try again.");
        }
        alert("Successfully became seller! Please log in again.");
      
        authService.logout();
        const appController = AppController.getInstance();
        appController.navigate('auth');
    }
}