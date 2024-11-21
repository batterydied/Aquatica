export function navigationMenu(container) {
  constructor() {
    this.container = document.createElement("div");
    this.container.classList.add("navigation-menu");

    this.createHeader();
    this.attachEventListeners();
  }

  createHeader() {
    const header = document.createElement("div");
    header.classList.add("header");

    // Logo
    const logoButton = document.createElement("div");
    logoButton.classList.add("logo-button");

    const logoImage = document.createElement("img");
    logoImage.src =
      "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/logo-1.svg";
    logoImage.alt = "Logo";
    logoImage.classList.add("logo-image");
    logoButton.appendChild(logoImage);

    header.appendChild(logoButton);

    // Links with SVG icons
    const links = [
      {
        text: "Sell",
        src: "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/sell-0.svg",
        className: "sell-button",
        target: "sellPage",
      },
      {
        text: "Virtual Cart",
        src: "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/cart-0.svg",
        className: "cart-button",
        target: "virtualCart",
      },
      {
        text: "Save For Later",
        src: "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/save-0.svg",
        className: "save-list-button",
        target: "saveForLater",
      },
      {
        text: "User Center",
        src: "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/profile-0.svg",
        className: "profile-button",
        target: "profilePage",
      },
    ];

    links.forEach((link) => {
      const button = document.createElement("div");
      button.classList.add("nav-button", link.className);

      // Add SVG icon
      const icon = document.createElement("img");
      icon.src = link.src;
      icon.alt = `${link.text} icon`;
      icon.classList.add("nav-icon");
      button.appendChild(icon);

      // Add text
      const textElement = document.createElement("span");
      textElement.textContent = link.text;
      textElement.classList.add("nav-text");
      button.appendChild(textElement);

      // Set navigation target
      button.dataset.target = link.target;

      header.appendChild(button);
    });

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
