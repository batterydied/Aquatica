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

/* 3. Logout Button: allows users to log out by invalidating their authentication token.
  - When the user clicks the button, the frontend will make a POST request to the /logout route in AuthRoutes.
  - The AuthController invalidates the token and the user is successfully logged out.
*/

/* 4. Password Reset Button: allows users to reset password by submitting new password after verification request.
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