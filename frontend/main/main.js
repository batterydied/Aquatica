import { AppController } from './app/AppController.js';

// Get the root container from the HTML file
const appContainer = document.getElementById('app');

// Create an instance of the main app controller
const appController = new AppController();

// IIFE to handle the async rendering
(async function () {
  const renderedApp = await appController.render(); // Await the async render
  appContainer.appendChild(renderedApp); // Append the rendered DOM
})();

