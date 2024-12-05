export default class OrderService {
  static baseUrl = "http://localhost:3000/api/order";

  // Fetch all orders
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

  // Add a new order
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

