// eventhub/CartEvents.js
import CartService from '../services/CartService.js';
import EventHub from './EventHub.js';

export default class CartEvents {
  // Fetch cart items and notify listeners
  static async fetchCart() {
    try {
      const { items } = await CartService.fetchCart();
      EventHub.publish('cartFetched', items);
    } catch (error) {
      EventHub.publish('cartError', error.message);
    }
  }

  // Fetch saved-for-later items
  static async fetchSavedItems() {
    try {
      const { items } = await CartService.fetchSavedItems();
      EventHub.publish('savedItemsFetched', items);
    } catch (error) {
      EventHub.publish('cartError', error.message);
    }
  }

  // Add an item to the cart and notify listeners
  static async addToCart(productId, quantity) {
    try {
      const newItem = await CartService.addToCart(productId, quantity);
      EventHub.publish('cartItemAdded', newItem);
    } catch (error) {
      EventHub.publish('cartError', error.message);
    }
  }

  // Remove an item from the cart and notify listeners
  static async removeFromCart(itemId) {
    try {
      await CartService.removeFromCart(itemId);
      EventHub.publish('cartItemRemoved', itemId);
    } catch (error) {
      EventHub.publish('cartError', error.message);
    }
  }

  // Save an item for later and notify listeners
  static async saveForLater(itemId) {
    try {
      const savedItem = await CartService.saveForLater(itemId);
      EventHub.publish('itemSavedForLater', savedItem);
    } catch (error) {
      EventHub.publish('cartError', error.message);
    }
  }

  // Move an item back to the cart and notify listeners
  static async moveToCart(itemId) {
    try {
      const movedItem = await CartService.moveToCart(itemId);
      EventHub.publish('itemMovedToCart', movedItem);
    } catch (error) {
      EventHub.publish('cartError', error.message);
    }
  }


static async updateCartItem(itemId, quantity) {
  try {
    const updatedItem = await CartService.updateCartItem(itemId, quantity);
    EventHub.publish("cartItemUpdated", updatedItem); // Publish update
  } catch (error) {
    EventHub.publish("cartError", error.message); // Handle errors
  }
}

}

