import { MarketplacePage } from '../components/MarketplacePage/MarketplacePage.js';
import { SecureCheckout } from '../components/SecureCheckout/SecureCheckout.js';
import { VirtualCart } from '../components/VirtualCart/VirtualCart.js';
import { NavigationMenu } from '../components/NavigationMenu/NavigationMenu.js';
import { ProfilePage } from '../components/ProfilePage/ProfilePage.js';
import { SellProductsPage } from '../components/MarketplacePage/SellProductsPage.js';
import { ProductPage } from '../components/ProductPage/ProductPage.js';
import { AuthPage } from '../components/AuthPage/AuthPage.js';
import { authService } from '../services/AuthService.js'; // Handles user authentication state

export class AppController {
  #container = null; // Main container for the entire app
  #viewContainer = null; // Container for the current view
  #navContainer = null; // Container for the navigation menu
  #currentView = null; // Tracks the current active view
  #views = {}; // Stores all available views

  static instance = null;

  constructor() {
    // Define all views
    this.#views = {
      auth: new AuthPage(),
      marketplace: new MarketplacePage(),
      secureCheckout: new SecureCheckout(),
      virtualCart: new VirtualCart(),
      navigationMenu: new NavigationMenu(),
      productPage: new ProductPage(),
      profilePage: new ProfilePage(),
      sellProductsPage: new SellProductsPage(),
    };

    // Set the initial view: Auth if not logged in, otherwise Marketplace
    this.#currentView = authService.isLoggedIn() ? this.#views.marketplace : this.#views.auth;
  }

  /**
   * Renders the app container, navigation menu, and current view.
   * @returns {HTMLElement} The app container.
   */
  async render() {
    // Create the main container if it doesn't exist
    if (!this.#container) {
      this.#container = document.createElement('div');
      this.#container.classList.add('app-controller');

      // Create and append the navigation menu container
      this.#navContainer = document.createElement('div');
      this.#navContainer.classList.add('navigation-menu');
      this.#container.appendChild(this.#navContainer);

      // Render the navigation menu once if logged in
      if (authService.isLoggedIn()) {
        this.#navContainer.appendChild(this.#views.navigationMenu.render());
      }

      // Create and append the view container
      this.#viewContainer = document.createElement('div');
      this.#viewContainer.classList.add('view-container');
      this.#container.appendChild(this.#viewContainer);
    }

    // Clear the current view container and render the active view
    this.#viewContainer.innerHTML = '';
    const content = await this.#currentView.render();
    this.#viewContainer.appendChild(content);

    return this.#container;
  }

  /**
   * Navigates to a specific view and ensures proper access control.
   * @param {string} viewName - The name of the view to navigate to.
   * @param {Object} params - Optional parameters for the view.
   */
  async navigate(viewName, params = {}) {
    // Ensure the view exists
    if (!this.#views[viewName]) {
      throw new Error(`View "${viewName}" not found.`);
    }

    // Restrict access to certain views based on authentication
    if (!authService.isLoggedIn() && viewName !== 'auth') {
      console.warn(`Access denied to "${viewName}". Redirecting to AuthPage.`);
      this.#currentView = this.#views.auth;
    } else if (viewName === 'sellProductsPage' && !authService.isSeller()) {
      console.warn(`Access denied to "${viewName}". Only sellers can access this page.`);
      this.#currentView = this.#views.marketplace;
    } else {
      this.#currentView = this.#views[viewName];
    }

    // Re-render the view container with the new view
    this.#viewContainer.innerHTML = '';
    const content = await this.#currentView.render();
    this.#viewContainer.appendChild(content);

    // Ensure the navigation menu remains intact
    if (!this.#navContainer.firstChild && authService.isLoggedIn()) {
      this.#navContainer.appendChild(this.#views.navigationMenu.render());
    }
  }

  /**
   * Singleton instance getter for AppController.
   * @returns {AppController} The single instance of AppController.
   */
  static getInstance() {
    if (!AppController.instance) {
      AppController.instance = new AppController();
    }
    return AppController.instance;
  }
}

