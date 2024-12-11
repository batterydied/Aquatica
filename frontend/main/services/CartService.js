/*
  CartService: Devin
  Description: This file defines the service layer for cart-related backend API 
               operations. It interacts with the backend endpoints to manage 
               cart items, saved-for-later items, and item updates.
  Issue: #50
  Owner: Devin
  Expected Outcome: A functional service layer that can handle API requests
                    like fetching, adding, updating, and saving cart items.

  - Method: fetchCart(): Fetches all cart items from the backend.
  - Method: fetchSavedItems(): Fetches saved-for-later items from the backend.
  - Method: addToCart(): Sends a POST request to add an item to the cart.
  - Method: removeFromCart(): Sends a DELETE request to remove an item from the cart.
  - Method: saveForLater(): Sends a POST request to mark an item as saved-for-later.
  - Method: moveToCart(): Sends a POST request to move an item back to the cart.
  - Method: updateCartItem(): Sends a PUT request to update an item's quantity in the cart.
*/

// CartService Class
export default class CartService {
  static baseUrl = "http://localhost:3000/api/cart"; // Base URL for cart-related API endpoints

  /**
   * Fetch all items in the cart.
   */
  static async fetchCart() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error("Failed to fetch cart items");
      return await response.json();
    } catch (error) {
      console.error("CartService fetchCart error:", error);
      throw error;
    }
  }

  /**
   * Fetch saved-for-later items.
   */
  static async fetchSavedItems() {
    try {
      const response = await fetch(`${this.baseUrl}/saved`);
      if (!response.ok) throw new Error("Failed to fetch saved items");
      return await response.json();
    } catch (error) {
      console.error("CartService fetchSavedItems error:", error);
      throw error;
    }
  }

  /**
   * Add an item to the cart.
   */
  static async addToCart(productId, quantity) {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) throw new Error("Failed to add item to cart");
      return await response.json();
    } catch (error) {
      console.error("CartService addToCart error:", error);
      throw error;
    }
  }

  /**
   * Remove an item from the cart.
   */
  static async removeFromCart(itemId) {
    try {
      const response = await fetch(`${this.baseUrl}/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove item");
      return response.status === 204 ? null : await response.json(); // Handle no-content response
    } catch (error) {
      console.error("CartService removeFromCart error:", error);
      throw error;
    }
  }

  /**
   * Save an item for later.
   */
  static async saveForLater(itemId) {
    try {
      const response = await fetch(`${this.baseUrl}/save/${itemId}`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to save item for later");
      return await response.json();
    } catch (error) {
      console.error("CartService saveForLater error:", error);
      throw error;
    }
  }

  /**
   * Move an item back to the cart.
   */
  static async moveToCart(itemId) {
    try {
      const response = await fetch(`${this.baseUrl}/move/${itemId}`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to move item to cart");
      return await response.json();
    } catch (error) {
      console.error("CartService moveToCart error:", error);
      throw error;
    }
  }

  /**
   * Update the quantity of a cart item.
   */
  static async updateCartItem(itemId, quantity) {
    try {
      const response = await fetch(`${this.baseUrl}/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error("Failed to update item quantity");
      return await response.json();
    } catch (error) {
      console.error("CartService updateCartItem error:", error);
      throw error;
    }
  }
}

