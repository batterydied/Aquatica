// services/CartService.js

export default class CartService {
  static baseUrl = 'http://localhost:3000/api/cart';

  // Fetch all items in the cart
  static async fetchCart() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Failed to fetch cart items');
      return await response.json();
    } catch (error) {
      console.error('CartService fetchCart error:', error);
      throw error;
    }
  }

  // Fetch saved-for-later items
  static async fetchSavedItems() {
    try {
      const response = await fetch(`${this.baseUrl}/saved`);
      if (!response.ok) throw new Error('Failed to fetch saved items');
      return await response.json();
    } catch (error) {
      console.error('CartService fetchSavedItems error:', error);
      throw error;
    }
  }

  // Add an item to the cart
  static async addToCart(productId, quantity) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) throw new Error('Failed to add item to cart');
      return await response.json();
    } catch (error) {
      console.error('CartService addToCart error:', error);
      throw error;
    }
  }

static async removeFromCart(itemId) {
  try {
    const response = await fetch(`${this.baseUrl}/${itemId}`, {
      method: 'DELETE',
    });

    // Handle HTTP response status
    if (!response.ok) {
      throw new Error(`Failed to remove item: ${response.statusText}`);
    }

    // If server returns no JSON (e.g., 204 status), avoid parsing JSON
    const result = response.status === 204 ? null : await response.json();
    return result;
  } catch (error) {
    console.error('CartService removeFromCart error:', error);
    throw error;
  }
}


  // Save an item for later
  static async saveForLater(itemId) {
    try {
      const response = await fetch(`${this.baseUrl}/save/${itemId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to save item for later');
      return await response.json();
    } catch (error) {
      console.error('CartService saveForLater error:', error);
      throw error;
    }
  }

  // Move an item back to the cart
  static async moveToCart(itemId) {
    try {
      const response = await fetch(`${this.baseUrl}/move/${itemId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to move item to cart');
      return await response.json();
    } catch (error) {
      console.error('CartService moveToCart error:', error);
      throw error;
    }
  }

static async updateCartItem(itemId, quantity) {
  try {
    const response = await fetch(`${this.baseUrl}/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) throw new Error('Failed to update item quantity');
    return await response.json();
  } catch (error) {
    console.error('CartService updateCartItem error:', error);
    throw error;
  }
}

}

