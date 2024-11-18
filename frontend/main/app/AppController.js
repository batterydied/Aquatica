// import { SecureCheckout } from '../components/SecureCheckout/SecureCheckout.js';
import { VirtualCart } from '../components/VirtualCart/VirtualCart.js';

export class AppController {
  #container = null;
  #currentView = null;
  #views = {};

  constructor() {
    this.#views = {
      // secureCheckout: new SecureCheckout(),
      virtualCart: new VirtualCart(this),
    };

    // Set default view
    this.#currentView = this.#views.virtualCart;
  }
   /**
   * Render the AppController container and initialize the default view.
   */
   async render() {
     if (!this.#container) {
       this.#container = document.createElement("div");
       this.#container.classList.add("app-controller");
     }

     this.#container.innerHTML = ""; // Clear previous content
     const viewContent = await this.#currentView.render(); // Await render of the view
     this.#container.appendChild(viewContent); // Append the rendered content

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

