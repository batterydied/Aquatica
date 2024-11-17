import { AppController } from './app/AppController.js';

// Get our root container from the HTML file
const appContainer = document.getElementById('app');

// Create an instance of the main app controller
const appController = new AppController();

// Render the appController and append it to the HTML container
appContainer.appendChild(appController.render());
