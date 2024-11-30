import { MarketplacePage } from '../components/MarketplacePage/MarketplacePage.js';
import { ProductService } from '../services/ProductService.js';
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
      productPage: null, // ProductPage will be dynamically initialized
      profilePage: new ProfilePage(),
      sellProductsPage: new SellProductsPage(),
    };

    // Set the default page as the marketplace
    this.#currentView = this.#views.marketplace;
  }

  render() {
    if (!this.#container) {
      this.#container = document.createElement('div');
      this.#container.classList.add('app-controller');
      this.#container.style.display = 'flex';
      this.#container.style.flexDirection = 'column';
      this.#container.style.justifyContent = 'center';
    }

    this.#container.innerHTML = ''; // Clear previous content
    this.#container.appendChild(this.#currentView.render()); // Render the current view

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

    if (viewName === 'productPage') {
      // Default to product ID '1a2b3c4d5e' if no ID is provided
      const productId = params.productId || '1a2b3c4d5e';

      // Dynamically initialize and fetch product data for ProductPage
      const productPage = new ProductPage();
      await productPage.fetchProductData(productId); // Load product data
      this.#views.productPage = productPage; // Store the initialized ProductPage
      this.#currentView = this.#views.productPage;
    } else {
      this.#currentView = this.#views[viewName];
    }

    this.render();
  }

  /**
   * Handle routing based on the current URL.
   */
  handleRoute() {
    const path = window.location.pathname; // Get the URL path
    const [route, productId] = path.split('/').filter(Boolean); // Extract route and params

    if (route === 'product' && productId) {
      this.navigate('productPage', { productId }); // Navigate to productPage with productId
    } else {
      this.navigate('marketplace'); // Default to marketplace
    }
  }

  static getInstance() {
    if (!AppController.instance) {
      AppController.instance = new AppController();
    }
    return AppController.instance;
  }
}
