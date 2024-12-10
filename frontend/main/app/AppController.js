import { MarketplacePage } from '../components/MarketplacePage/MarketplacePage.js';
import { SecureCheckout } from '../components/SecureCheckout/SecureCheckout.js';
import { VirtualCart } from '../components/VirtualCart/VirtualCart.js';
import { ProductPage } from '../components/ProductPage/ProductPage.js';
import { NavigationMenu } from '../components/NavigationMenu/NavigationMenu.js';
import { ProfilePage } from '../components/ProfilePage/ProfilePage.js';
import { SellProductsPage } from '../components/MarketplacePage/SellProductsPage.js';

export class AppController {
   #container = null;
   #currentView = null; // Track the currently rendered view
   #views = {}; // Store initialized views
   #navigationMenu = null; // Navigation menu component
   static instance = null; // Singleton instance

   constructor() {
     // Initialize components
     this.#views = {
       marketplace: new MarketplacePage(),
       secureCheckout: new SecureCheckout(),
       virtualCart: new VirtualCart(),
       navigationMenu: new NavigationMenu(),
       productPage: new ProductPage(), // ProductPage is dynamically initialized when needed
       profilePage: new ProfilePage(),
       sellProductsPage: new SellProductsPage(),
     };

     // Set the default page as the marketplace
     this.#currentView = this.#views.marketplace;
   }

   async render(id=null) {
     if (!this.#container) {
       this.#container = document.createElement('div');
       this.#container.classList.add('app-controller');
       this.#container.style.display = 'flex';
       this.#container.style.flexDirection = 'column';
       this.#container.style.justifyContent = 'center';
     }

     this.#container.innerHTML = ''; // Clear previous content
     let content;
     if(!id){
      content = await this.#currentView.render();
     }else{
      content = await this.#currentView.render(id);
     }
     this.#container.appendChild(content); // Render the current view

     // Add navigation menu except for specific views
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
      this.currentViewParams = params; // store params publicly
      this.#currentView = this.#views[viewName];
     if(viewName === 'productPage'){
      this.render(params.prodid);
     }else{
      this.render();
     }
   }

   static getInstance() {
     if (!AppController.instance) {
       AppController.instance = new AppController();
     }
     return AppController.instance;
   }
}
