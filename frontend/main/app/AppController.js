import { MarketplacePage } from '../components/MarketplacePage/MarketplacePage.js';
import { SecureCheckout } from '../components/SecureCheckout/SecureCheckout.js';
import { VirtualCart } from '../components/VirtualCart/VirtualCart.js';
import { ProductPage } from '../components/ProductPage/ProductPage.js';
import { NavigationMenu } from '../components/NavigationMenu/NavigationMenu.js';
import { ProfilePage } from '../components/ProfilePage/ProfilePage.js';
import { SellProductsPage } from '../components/MarketplacePage/SellProductsPage.js';
import { AuthPage } from '../components/AuthPage/AuthPage.js';
import { authService } from '../services/AuthService.js'; // Handles user authentication state

export class AppController {
   #container = null;       // Main container
   #viewContainer = null;   // View-specific container
   #navContainer = null;    // Navigation Menu container
   #currentView = null;     // Track the currently rendered view
   #views = {};             // Store initialized views
   
   static instance = null;  // Singleton instance

   constructor() {
     // Define all views
     this.#views = {
       auth: new AuthPage(),
       marketplace: new MarketplacePage(),
       secureCheckout: new SecureCheckout(),
       virtualCart: new VirtualCart(),
       navigationMenu: new NavigationMenu(),
       productPage: new ProductPage(), // ProductPage is dynamically initialized when needed
       profilePage: new ProfilePage(),
       sellProductsPage: new SellProductsPage(),
     };

     // Set the initial view to AuthPage if not logged in, else default page is the marketplace
     this.#currentView = authService.isLoggedIn() ? this.#views.marketplace : this.#views.auth;
   }

   /**
    * Renders the main container, navigation menu, and the current view.
    */
   async render(id=null) {
     if (!this.#container) {
       this.#container = document.createElement('div');
       this.#container.classList.add('app-controller');
      //  this.#container.style.display = 'flex';
      //  this.#container.style.flexDirection = 'column';
      //  this.#container.style.justifyContent = 'center';

      /** Create and append the navigation menu container. */
      //  this.#navContainer = document.createElement('div');
      //  this.#navContainer.classList.add('navigation-menu');
      //  this.#container.appendChild(this.#navContainer);

      //  // TODO Render the navigation menu once logged in: Need?
      //  if(authService.isLoggedIn()) this.#navContainer.appendChild(this.#views.navigationMenu.render());

       this.#viewContainer = document.createElement('div');
       this.#viewContainer.classList.add('view-container');

       this.#container.appendChild(this.#viewContainer);
     }

     this.#viewContainer.innerHTML = ''; // Clear previous content
     let content;
     if (id) {
      content = await this.#currentView.render(id);
     } else {
      content = await this.#currentView.render(); // authenticated
     }
     this.#viewContainer.appendChild(content); // Render the current view

     // TODO Add navigation menu except for specific views
     if (this.#currentView !== this.#views.secureCheckout) {
       this.#container.prepend(this.#views.navigationMenu.render());
     }

     return this.#container;
   }

   /**
    * Navigate to a specific view.
    * @param {string} viewName - The name of the view to navigate to.
    * @param {Object} params - Additional parameters to pass to the view.
    */
   async navigate(viewName, params = {}) {
    if (!this.#views[viewName]) {
      throw new Error(`View "${viewName}" not found.`);
    }

     // Restrict access to certain views based on authentication
    if(!authService.isLoggedIn() && (viewName !== 'auth' && viewName !== 'marketplace' )){
      console.warn(`Access denied to "${viewName}". Login for more!`);
      this.#currentView = this.#views.auth;
    } else if (viewName === 'sellProductsPage' && !authService.isSeller()){ // TODO Profile update seller identity
      console.warn(`Access denied to "${viewName}". Only sellers can access this page. Apply in User Center to become a seller!`);
      this.#currentView = this.#views.marketplace;
     } else {
        this.#currentView = this.#views[viewName];
     }

    if (viewName === 'productPage') {
      console.log(params.prodid);
      await this.render(params.prodid);
    } else {
      await this.render();
    }
   }

   static getInstance() {
     if (!AppController.instance) {
       AppController.instance = new AppController();
     }
     return AppController.instance;
   }
}
