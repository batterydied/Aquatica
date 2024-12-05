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
        //  Check if user is defined and not null, while token is not expired
        return !!this.user && !this.isTokenExpired(this.user.token); 
    }

    isTokenExpired() {
        //  Check if the token is expired
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);  // Current time in seconds
        return payload.exp < now;
      } catch (error) {
        console.error("Error decoding token:", error);
        return true;    // Just treat as expired if decoding fails
      }
    }

    login(token, userId) {
        if (!token || !userId) throw new Error("Invalid token or user ID.")

        const user = { token, userId };
        this.user = user;
        localStorage.setItem("user", JSON.stringify(user)); // Clear user data from localStorage
    }

    logout() {
        this.user = null;
        localStorage.removeItem("user"); // Clear user data from localStorage
    }

    getRole() {
        if (!this.user || !this.user.token) return null;
      try{
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.roles || null;
      } catch (error) {
        console.error("Error receiving roles:", error);
        return null;
      }
    }
}