// Function to redirect user to a specific page
// Stay on top of all pages

export function createNavigation(container){
    const navigationMenu = document.createElement("div");
    navigationMenu.classList.add("navigation-menu");

    const header = document.createElement("div");
    header.classList.add("header");

    const logoButton = document.createElement("div");
    logoButton.classList.add("logo-button");
    logoButton.src = "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/logo-1.svg"; 
    header.appendChild(logoButton);

    const Links = [
        { text: "Sell", src: "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/sell-0.svg",           className: "sell-button"}, 
        { text: "Virtual Cart", src: "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/cart-0.svg",   className: "cart-button"},
        { text: "Save For Later", src: "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/save-0.svg", className: "save-list-button"},
        { text: "User Center", src: "https://github.com/batterydied/Aquatica/blob/6b4de9b95524fb1032619fbe91e69632eebeb230/frontend/assets/navigation-menu/profile-0.svg", className: "profile-button"},
    ];

    Links.forEach(link => {
        const button = document.createElement("div");
        button.classList.add(link.className);

        const styleClass = link.text.toLowerCase().replace(" ","-");
        
        const txt = document.createElement("div");
        txt.innerText = link.text;
        txt.classList.add(styleClass);

        const icon = document.createElement("img");
        icon.src = link.src;
        icon.classList.add("icons");
        
        button.appendChild(txt);
        button.appendChild(icon);
        header.appendChild(button);
    });

    navigationMenu.appendChild(header);
    this.container.prepend(navigationMenu);
}  