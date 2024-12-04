export class AuthService {
  constructor() {
    try {
      const storedUser = localStorage.getItem("user");
      this.user = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      this.user = null;
    }
  }

  isLoggedIn() {
    return !!this.user; // Return true if user is defined and not null
  }

  login(token, userId) {
    const user = { token, userId };
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user)); // Store user in localStorage
  }

  logout() {
    this.user = null;
    localStorage.removeItem("user"); // Clear user data from localStorage
  }
}

export const authService = new AuthService();

