// services/OrderService.js

export default class OrderService {
  static baseUrl = 'http://localhost:3000/api/cart';

  // Fetch all orders
  static async fetchOrders() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('OrderService fetchOrder error:', error);
      throw error;
    }
  }


  // Add an new order
  static async addOrder(productId) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error('Failed to add item to cart');
      return await response.json();
    } catch (error) {
      console.error('CartService addToCart error:', error);
      throw error;
    }
  }
}
