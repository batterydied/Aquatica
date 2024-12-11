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
    const container = document.createElement("div");
    container.classList.add("container");
    const header = document.createElement("div");
    header.classList.add("navigation-menu");
    container.appendChild(header);


    // Logo Section
    const logoButton = document.createElement("div");
    // Logo Unique CSS, while link for Marketplace
    logoButton.classList.add("logo-button", "nav-button");
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
      { text: "Marketplace", iconName: "fa-shop", className: "marketplace", target: "marketplace" },
      { text: "Seller Page", iconName: "fa-money-bill", className: "sellProductsPage", target: "sellProductsPage" },
      { text: "Virtual Cart", iconName: "fa-cart-shopping", className: "virtualCart", target: "virtualCart" },
      { text: "User Center", iconName: "fa-user", className: "profilePage", target: "profilePage" },
    ];


    links.forEach((link) => {
      const button = document.createElement("div");
      button.classList.add("nav-button", link.className);
      // default page Marketplace is active once entered
      if (link.className === "marketplace") {
        button.classList.add("active");
      }
      // Set the data-target attribute
      button.dataset.target = link.target;

      // Add text first
      const textElement = document.createElement("span");
      textElement.textContent = link.text;
      textElement.classList.add("nav-text");
      button.appendChild(textElement);

      // Add icon second
      const icon = document.createElement("i");
      icon.classList.add("fa-solid", link.iconName, "fa-lg");
      button.appendChild(icon);

      navButtonsContainer.appendChild(button);
    });

    // Append Logo and Navigation Buttons to the Header
    header.appendChild(logoButton);
    header.appendChild(navButtonsContainer);
    this.container.appendChild(container);
  }

  attachEventListeners() {
    this.container.addEventListener("click", (event) => {
      const button = event.target.closest(".nav-button");
      if (button) {
        const targetView = button.dataset.target;

        // Remove active class from all buttons
        const navButtons = this.container.querySelectorAll(".nav-button");
        navButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        button.classList.add("active");

        // Navigate to target view
        const appController = AppController.getInstance();
        appController.navigate(targetView);
      }
    });
  }

  render() {

    return this.container;
  }
}
