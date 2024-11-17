// This will render all of our app's features.

// Imports
import { ProductPage } from '../components/ProductPage/productpage.js'

export class AppController {
  #container = null;
  #currentView = null; // Track the currently rendered view
  #views = {}; // Store initialized views

  constructor() {
    // Initialize components
    this.#views = {
      productPage: new ProductPage(),
    };

    // Set the initial view for testing ((THIS IS JUST FOR TESTING MY (DEVIN) COMPONENTS))
    this.#currentView = this.#views.productPage;
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
}

