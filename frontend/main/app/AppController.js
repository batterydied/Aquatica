// This will render all of our apps features.

// Imports
import { SecureCheckout } from '../components/SecureCheckout/securecheckout.js';

export class AppController {
   constructor(){
      // Add any states or components here.
      this.secureCheckout = new SecureCheckout();
   }


   render() {
      // Make the main container.
      const container = document.createElement('div');
      container.classList.add('app-controller');

      // Render and append components
      container.appendChild(this.secureCheckout.render());

      return container; 
   }
}
