import { AppController } from '../../app/AppController.js';
import { BaseComponent } from '../../app/BaseComponent.js';
export class NavigationMenu extends BaseComponent {
  constructor() {
    super();
    this.container = document.createElement("div");
    this.loadCSS("NavigationMenu");
    this.createHeader();
    this.attachEventListeners();
  }



  createHeader() {
    const header = document.createElement("div");
    header.classList.add("navigation-menu");


    // Logo Section
    const logoButton = document.createElement("div");
    // Logo Unique CSS
    logoButton.classList.add("logo-button");
    // Link for Marketplace
    logoButton.classList.add("nav-button");
    logoButton.dataset.target = "marketplace";

    const logoImage = document.createElement("img");
    logoImage.src = "../../../assets/navigation-menu/new-logo.svg";
    logoImage.alt = "Logo";
    logoImage.classList.add("logo-image");
    logoButton.appendChild(logoImage);

    // Navigation Buttons Section
    const navButtonsContainer = document.createElement("div");
    navButtonsContainer.classList.add("nav-buttons-container");


    const links = [
      { text: "Marketplace", src: "../../../assets/navigation-menu/sell-0.svg", className: "marketplace-button", target: "marketplace" },
      { text: "Seller Page", src: "../../../assets/navigation-menu/save-0.svg", className: "sell-button", target: "sellProductsPage" },
      { text: "Virtual Cart", src: "../../../assets/navigation-menu/cart-0.svg", className: "cart-button", target: "virtualCart" },
      { text: "User Center", src: "../../../assets/navigation-menu/profile-0.svg", className: "profile-button", target: "profilePage" },
    ];


    links.forEach((link) => {
      const button = document.createElement("div");
      button.classList.add("nav-button", link.className);

      // Set the data-target attribute
      button.dataset.target = link.target;

      // Add text first
      const textElement = document.createElement("span");
      textElement.textContent = link.text;
      textElement.classList.add("nav-text");
      button.appendChild(textElement);

      // Add icon second
      const icon = document.createElement("img");
      icon.src = link.src;
      icon.alt = `${link.text} icon`;
      icon.classList.add("nav-icon");
      button.appendChild(icon);

      navButtonsContainer.appendChild(button);
    });

    // Append Logo and Navigation Buttons to the Header
    header.appendChild(logoButton);
    header.appendChild(navButtonsContainer);
    this.container.appendChild(header);
  }

  attachEventListeners() {
    this.container.addEventListener("click", (event) => {
      const button = event.target.closest(".nav-button");
      if (button) {
        const targetView = button.dataset.target;
        const appController = AppController.getInstance();
        appController.navigate(targetView);
      }
    });
  }

  render() {
    return this.container;
  }
}
