/*
  OrderService: Devin
  Description: This file defines the service layer for order-related backend API 
               operations. It interacts with the backend endpoints to manage 
               fetching and adding orders.
  Issue: #52
  Owner: Devin
  Expected Outcome: A functional service layer that can handle API requests
                    like fetching and adding orders.

  - Method: fetchOrders(): Fetches all orders from the backend.
  - Method: addOrder(): Sends a POST request to add a new order.
*/

// OrderService Class
export default class OrderService {
  static baseUrl = "http://localhost:3000/api/order"; // Base URL for order-related API endpoints

  /**
   * Fetch all orders from the backend.
   */
  static async fetchOrders() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error("Failed to fetch orders");
      return await response.json();
    } catch (error) {
      console.error("OrderService fetchOrders error:", error);
      throw error;
    }
  }

  /**
   * Add a new order to the backend.
   * @param {Object} orderData - The data for the new order.
   */
  static async addOrder(orderData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData), // Pass the entire order data object
      });
      if (!response.ok) throw new Error("Failed to add order");
      return await response.json();
    } catch (error) {
      console.error("OrderService addOrder error:", error);
      throw error;
    }
  }
}

