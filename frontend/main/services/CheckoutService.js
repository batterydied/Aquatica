/*
  OrderService: Devin
  Description: This file provides an interface for interacting with the backend API for
               managing order-related operations. It includes methods for fetching
               orders and adding new orders through HTTP requests.

  Issue: #50
  Owner: Devin
  Expected Outcome: A service layer that seamlessly communicates with the backend to
                    manage orders, ensuring clear error handling and reusable methods.

  Interface with the backend API at the base URL: 'http://localhost:3000/api/cart'.

  - Method: fetchOrders(): Retrieves all orders from the backend.
  - Method: addOrder(productId): Sends a new order to the backend for processing.
*/

// OrderService Class
export default class OrderService {
  // Base URL for the order-related API endpoints
  static baseUrl = 'http://localhost:3000/api/cart';

  /**
   * Fetch all orders from the backend.
   * 
   * @returns {Promise<Object>} - The response JSON containing order details.
   * @throws {Error} - If the API call fails or returns a non-OK response.
   */
  static async fetchOrders() {
    try {
      const response = await fetch(this.baseUrl); // Perform GET request to fetch orders
      if (!response.ok) throw new Error('Failed to fetch orders'); // Handle non-OK response
      return await response.json(); // Parse and return JSON response
    } catch (error) {
      console.error('OrderService fetchOrders error:', error); // Log error for debugging
      throw error; // Propagate the error to the caller
    }
  }

  /**
   * Add a new order to the backend.
   * 
   * @param {string} productId - The ID of the product to be added as an order.
   * @returns {Promise<Object>} - The response JSON containing the newly added order details.
   * @throws {Error} - If the API call fails or returns a non-OK response.
   */
  static async addOrder(productId) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST', // HTTP POST request
        headers: { 'Content-Type': 'application/json' }, // Set content type as JSON
        body: JSON.stringify({ productId }), // Serialize productId into JSON
      });
      if (!response.ok) throw new Error('Failed to add item to cart'); // Handle non-OK response
      return await response.json(); // Parse and return JSON response
    } catch (error) {
      console.error('OrderService addOrder error:', error); // Log error for debugging
      throw error; // Propagate the error to the caller
    }
  }
}

