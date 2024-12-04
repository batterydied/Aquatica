import { MarketplacePage } from '../components/MarketplacePage/MarketplacePage.js';
import { SecureCheckout } from '../components/SecureCheckout/SecureCheckout.js';
import { VirtualCart } from '../components/VirtualCart/VirtualCart.js';
import { NavigationMenu } from '../components/NavigationMenu/NavigationMenu.js';
import { ProfilePage } from '../components/ProfilePage/ProfilePage.js';
import { SellProductsPage } from '../components/MarketplacePage/SellProductsPage.js';
import { ProductPage } from '../components/ProductPage/ProductPage.js';
import { AuthPage } from '../components/Auth/AuthPage.js';
import { authService } from '../services/AuthService.js'; // Handles user authentication state

export class AppController {
  #container = null; // Main container
  #viewContainer = null; // View-specific container
  #currentView = null; // Current active view
  #views = {}; // Available views

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

    // Set initial view to `auth` if not authenticated
    this.#currentView = authService.isLoggedIn() ? this.#views.marketplace : this.#views.auth;
  }

  /**
   * Renders the main container and the current view.
   */
  async render() {
    if (!this.#container) {
      this.#container = document.createElement('div');
      this.#container.classList.add('app-controller');

      this.#viewContainer = document.createElement('div');
      this.#viewContainer.classList.add('view-container');

      this.#container.appendChild(this.#viewContainer);
    }

    this.#viewContainer.innerHTML = ''; // Clear previous view
    const content = await this.#currentView.render();
    this.#viewContainer.appendChild(content);

    return this.#container;
  }

  /**
   * Navigates to a specific view after checking access.
   * @param {string} viewName - The name of the view to navigate to.
   * @param {Object} params - Additional parameters for the view.
   */
  async navigate(viewName, params = {}) {
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

    await this.render();
  }

  static getInstance() {
    if (!AppController.instance) {
      AppController.instance = new AppController();
    }
    return AppController.instance;
  }
}

