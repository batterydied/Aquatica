class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user')) || null;
  }

  login(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isLoggedIn() {
    return !!this.token;
  }

  isSeller() {
    return this.user?.roles?.includes('seller');
  }

  getUserId() {
    return this.user?.userId || null;
  }
}

export const authService = new AuthService();

