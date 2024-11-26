import { AppController } from '../../app/AppController.js';
import { BaseComponent } from '../../app/BaseComponent.js';
import { icons } from './icons.js';

export class NavigationMenu extends BaseComponent {
  constructor() {
    super();
    this.container = document.createElement("div");
    this.container.classList.add("navigation-menu");
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
    logoImage.src = icons[1];
    logoImage.alt = "Logo";
    logoImage.classList.add("logo-image");
    logoButton.appendChild(logoImage);

    // Navigation Buttons Section
    const navButtonsContainer = document.createElement("div");
    navButtonsContainer.classList.add("nav-buttons-container");


    const links = [ // TODO Add Save-for-later feature for better user experience if extra time.
      { text: "Seller Page", src: icons[2], className: "sell-button", target: "sellProductsPage" },
      { text: "Marketplace", src: icons[4], className: "marketplace-button", target: "marketplace" },
      { text: "Virtual Cart", src: icons[8], className: "cart-button", target: "virtualCart" },
      { text: "User Center", src: icons[10], className: "profile-button", target: "profilePage" },
      // TODO links[3].text will be initialized as "Log In" after AuthPage implemented.
  
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
