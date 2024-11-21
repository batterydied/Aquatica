 /*   const Links = [
        { text: "Sell", src: "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/sell-0.svg",           className: "sell-button"}, 
        { text: "Virtual Cart", src: "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/cart-0.svg",   className: "cart-button"},
        { text: "Save For Later", src: "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/save-0.svg", className: "save-list-button"},
        { text: "User Center", src: "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/profile-0.svg", className: "profile-button"},
    ];
*/

export function navigationMenu(container){
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
    logoImage.src = "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/logo-1.svg";
    logoImage.alt = "Logo";
    logoImage.classList.add("logo-image");
    logoButton.appendChild(logoImage);

    header.appendChild(logoButton);

    // Links
    const links = [
      { text: "Marketplace", className: "marketplace-button", target: "marketplace" },
      { text: "Seller Page", className: "seller-page-button", target: "sellerPage" },
      { text: "Cart", className: "cart-button", target: "virtualCart" },
      { text: "Profile", className: "profile-button", target: "profie" },
    ];

    links.forEach((link) => {
      const button = document.createElement("div");
      button.classList.add("nav-button", link.className);

      const textElement = document.createElement("span");
      textElement.textContent = link.text;
      textElement.classList.add("nav-text");

      button.dataset.target = link.target;
      button.appendChild(textElement);
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
