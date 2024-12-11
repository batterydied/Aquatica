// AuthPage: Haiyi
// **Description**: Add front-end forms for user registration and login. 
    // Integrate these forms with the corresponding back-end routes using fetch or Axios for API calls.
// **Owner**: Haiyi
// **Expected Outcome**: Functional registration and login forms that communicate with the back-end.

/* Connect the AuthPage to backend APIs to handle the following operations:
  - sign up, log in, log out, password reset.
*/

// AuthPage serves as the UI to interact with AuthController and AuthRoutes for authentication-related operations.

/* 1. Register Page: allows new users to register by submitting their email, password, and possibly other user details.
  - When the user submits the form, the frontend will make a POST request to the /register route in AuthRoutes.
  - The AuthController handles the logic for registering users: password hashing, user validation, and generating a token.
  - The server sends back a success message, and the frontend redirects the user to the login page.
*/

/* 2. Login Page: allows users to log into their account by submitting their email and password.
  - When the user submits the form, the frontend will make a POST request to the /login route in AuthRoutes.
  - The AuthController validates the credentials, hashes and compares the password, and generates a token for success login.
  - The server returns the generated token, which is then stored for future authenticated requests.  
*/

/* 3. NOT_IMPLEMENTED_ON_PROFILE_PAGE_Logout Button: allows users to log out by invalidating their authentication token.
  - When the user clicks the button, the frontend will make a POST request to the /logout route in AuthRoutes.
  - The AuthController invalidates the token and the user is successfully logged out.
*/

/* 4. NOT_IMPLEMENTED_ON_PROFILE_PAGE_Password Reset Button: allows users to reset password by submitting new password after verification request.
  *__FIX_ME__Using email validation: using the code sent to email for validate, or 
  *                                   making the separate reset page accessible through email.
  - When the user clicks the Password Reset button, the frontend page displays a form to request a password reset.
  - Sends a POST request to AuthRoutes for initiating the password reset process.
  - Provides an interface for users to enter a new password after verification.
  - Sends a POST request to AuthRoutes for updating the password.
*/

/* Coder Note
  *5* Design the Frontend Interface: AuthPage
    The AuthPage provides the user interface for interacting with the authentication system. 
    It will only function properly once the backend routes and logic are implemented.
  *Logic:
    - Create UI forms for login, registration, and password reset.
    - Use API calls to connect with the AuthRoutes.
    - Dependencies: The AuthPage interacts with the AuthRoutes to send and receive data for authentication processes.
*/

import { BaseComponent } from '../../app/BaseComponent.js';
import { authService } from '../../services/AuthService.js';
import { AppController } from '../../app/AppController.js';

export class AuthPage extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('AuthPage');
  }

  async render() {
    this.container.innerHTML = ''; // Clear container
    this.container.appendChild(this.#createAccountForm()); // Start with Create Account form

    return this.container;
  }

  /**
   * Creates the "Create Account" form and handles submission.
   */
  #createAccountForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
      <h2>Create Account</h2>
      <form id="create-account-form">
        <input type="email" id="email" placeholder="Email" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Create Account</button>
      </form>
      <button id="switch-to-login">Already have an account? Login</button>
    `;

    formContainer.querySelector('#create-account-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;

      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        alert('Registration successful. Please log in.');
        this.container.innerHTML = ''; // Clear the container
        this.container.appendChild(this.#loginForm()); // Switch to Login form
      } catch (error) {
        alert('Registration failed: ' + error.message);
      }
    });

    formContainer.querySelector('#switch-to-login').addEventListener('click', () => {
      this.container.innerHTML = ''; // Clear the container
      this.container.appendChild(this.#loginForm()); // Switch to Login form
    });

    return formContainer;
  }

  /**
   * Creates the "Login" form and handles submission.
   */
  #loginForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
      <h2>Login</h2>
      <form id="login-form">
        <input type="email" id="email" placeholder="Email" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <button id="switch-to-create-account">Don't have an account? Create one</button>
    `;

    formContainer.querySelector('#login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;

      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const { token, userId } = await response.json();
        authService.login(token, userId);

        alert('Login successful');
        AppController.getInstance().navigate('marketplace'); // Redirect to the marketplace
      } catch (error) {
        alert('Login failed: ' + error.message);
      }
    });

    formContainer.querySelector('#switch-to-create-account').addEventListener('click', () => {
      this.container.innerHTML = ''; // Clear the container
      this.container.appendChild(this.#createAccountForm()); // Switch to Create Account form
    });

    return formContainer;
  }
}

