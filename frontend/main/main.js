// import { AppController } from './app/AppController.js';

// // Get our root container from the HTML file
// const appContainer = document.getElementById('app');

// // Create an instance of the main app controller
// const appController = AppController.getInstance();

// // Render the appController and append it to the HTML container
// appContainer.appendChild(appController.render());
import { ProductPage } from './components/ProductPage/ProductPage.js';

const appContainer = document.getElementById('app');
const productPage = new ProductPage();

// Default to rendering a specific product
const defaultProductId = '1a2b3c4d5e';

(async () => {
  const productPageContent = await productPage.render(defaultProductId);
  appContainer.appendChild(productPageContent);
})();
