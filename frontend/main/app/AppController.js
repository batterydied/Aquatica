// This will render all of our apps features.

// Imports
// EXAMPLE - import { SecureCheckout } from '../components/SecureCheckout/securecheckout.js';
import { ProfilePage } from "../components/ProfilePage/Profile.js";
export class AppController {
   constructor(){
      // Add any states or components here.
      // EXAMPLE - this.secureCheckout = new SecureCheckout();
   }


   render() {
      // Make the main container.
      const container = document.createElement('div');
      container.classList.add('app-controller');

      // Render and append components
      // EXAMPLE - container.appendChild(this.secureCheckout.render());

      const profilePage = new ProfilePage().render();
      container.appendChild(ProfilePage);
      return container; 
   }
}
