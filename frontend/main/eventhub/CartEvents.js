// eventhub/CartEvents.js
import CartService from '../services/CartService.js';
import { EventHub, hub } from './EventHub.js';

export default class CartEvents {
  // Fetch cart items and notify listeners
  static async fetchCart() {
    try {
      const { items } = await CartService.fetchCart();
      hub.publish('cartFetched', items);
    } catch (error) {
      hub.publish('cartError', error.message);
    }
  }

  // Fetch saved-for-later items
  static async fetchSavedItems() {
    try {
      const { items } = await CartService.fetchSavedItems();
      hub.publish('savedItemsFetched', items);
    } catch (error) {
      hub.publish('cartError', error.message);
    }
  }

  // Add an item to the cart and notify listeners
  static async addToCart(productId, quantity) {
    try {
      const newItem = await CartService.addToCart(productId, quantity);
      hub.publish('cartItemAdded', newItem);
    } catch (error) {
      hub.publish('cartError', error.message);
    }
  }

  // Remove an item from the cart and notify listeners
  static async removeFromCart(itemId) {
    try {
      await CartService.removeFromCart(itemId);
      hub.publish('cartItemRemoved', itemId);
    } catch (error) {
      hub.publish('cartError', error.message);
    }
  }

  // Save an item for later and notify listeners
  static async saveForLater(itemId) {
    try {
      const savedItem = await CartService.saveForLater(itemId);
      hub.publish('itemSavedForLater', savedItem);
    } catch (error) {
      hub.publish('cartError', error.message);
    }
  }

  // Move an item back to the cart and notify listeners
  static async moveToCart(itemId) {
    try {
      const movedItem = await CartService.moveToCart(itemId);
      hub.publish('itemMovedToCart', movedItem);
    } catch (error) {
      hub.publish('cartError', error.message);
    }
  }


static async updateCartItem(itemId, quantity) {
  try {
    const updatedItem = await CartService.updateCartItem(itemId, quantity);
    hub.publish("cartItemUpdated", updatedItem); // Publish update
  } catch (error) {
    hub.publish("cartError", error.message); // Handle errors
  }
}

}

