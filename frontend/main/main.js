import { AppController } from './app/AppController.js';

const appContainer = document.getElementById('app');
const appController = AppController.getInstance();

// Render the initial view based on authentication state
const appContent = await appController.render();
appContainer.appendChild(appContent);

