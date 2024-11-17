// This will render all of our app's features.

// Imports
import { MarketplacePage } from '../components/MarketplacePage/MarketplacePage.js';
import { ProductService } from '../services/ProductService.js';
import { ProfileService } from '../services/ProfileService.js';

export class AppController {
   #container = null;
   #currentView = null; // Track the currently rendered view
   #views = {}; // Store initialized views

   constructor() {
      // Initialize components
      this.#views = {
         marketplace: new MarketplacePage()
      };

      // TESTING FOR MARKETPLACEPAGE
      this.#currentView = this.#views.marketplace;
   }

   /**
   * Render the AppController container and initialize the default view.
   */
   render() {
      // Create the main container if not already created
      if (!this.#container) {
         this.#container = document.createElement('div');
         this.#container.classList.add('app-controller');
      }

      // Render the current view (Cart for testing)
      this.#container.innerHTML = ''; // Clear previous content
      this.#container.appendChild(this.#currentView.render());

      return this.#container;
   }

   /**
   * Public method to navigate to a different view.
   * @param {string} viewName - The name of the view to navigate to.
   */
   navigate(viewName) {
      // Check if the view exists
      if (!this.#views[viewName]) {
      throw new Error(`View "${viewName}" not found.`);
      }

      // Switch to the new view
      this.#currentView = this.#views[viewName];
      // Re-render the app controller with the new view
      this.render();
   }

   static getInstance() {
      if (!AppController.instance) {
         AppController.instance = new AppController;
      }
      return AppController.instance;
   }
}

