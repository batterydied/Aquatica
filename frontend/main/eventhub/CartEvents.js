/*
  CartEvents: Devin
  Description: This file handles publishing and subscribing to cart-related events
               through the EventHub. It acts as a bridge between the CartService
               and the components that need to react to cart actions.
  Issue: #50
  Owner: Devin
  Expected Outcome: A functional event system for managing cart-related actions
                    like fetching, adding, saving, and removing items.

  - Method: fetchCart(): Fetches cart items from the backend and notifies listeners.
  - Method: fetchSavedItems(): Fetches saved-for-later items from the backend.
  - Method: addToCart(): Adds an item to the cart and notifies listeners.
  - Method: removeFromCart(): Removes an item from the cart and notifies listeners.
  - Method: saveForLater(): Marks an item as saved-for-later and notifies listeners.
  - Method: moveToCart(): Moves an item from saved-for-later back to the cart.
  - Method: updateCartItem(): Updates the quantity of a cart item and notifies listeners.
*/

// Imports
import CartService from "../services/CartService.js";
import { EventHub, hub } from "./EventHub.js";

// CartEvents Class
export default class CartEvents {
  /**
   * Fetch cart items and notify listeners.
   */
  static async fetchCart() {
    try {
      const { items } = await CartService.fetchCart();
      hub.publish("cartFetched", items);
    } catch (error) {
      hub.publish("cartError", error.message);
    }
  }

  /**
   * Fetch saved-for-later items and notify listeners.
   */
  static async fetchSavedItems() {
    try {
      const { items } = await CartService.fetchSavedItems();
      hub.publish("savedItemsFetched", items);
    } catch (error) {
      hub.publish("cartError", error.message);
    }
  }

  /**
   * Add an item to the cart and notify listeners.
   */
  static async addToCart(productId, quantity) {
    try {
      const newItem = await CartService.addToCart(productId, quantity);
      hub.publish("cartItemAdded", newItem);
    } catch (error) {
      hub.publish("cartError", error.message);
    }
  }

  /**
   * Remove an item from the cart and notify listeners.
   */
  static async removeFromCart(itemId) {
    try {
      await CartService.removeFromCart(itemId);
      hub.publish("cartItemRemoved", itemId);
    } catch (error) {
      hub.publish("cartError", error.message);
    }
  }

  /**
   * Save an item for later and notify listeners.
   */
  static async saveForLater(itemId) {
    try {
      const savedItem = await CartService.saveForLater(itemId);
      hub.publish("itemSavedForLater", savedItem);
    } catch (error) {
      hub.publish("cartError", error.message);
    }
  }

  /**
   * Move an item back to the cart and notify listeners.
   */
  static async moveToCart(itemId) {
    try {
      const movedItem = await CartService.moveToCart(itemId);
      hub.publish("itemMovedToCart", movedItem);
    } catch (error) {
      hub.publish("cartError", error.message);
    }
  }

  /**
   * Update the quantity of a cart item and notify listeners.
   */
  static async updateCartItem(itemId, quantity) {
  try {
    const updatedItem = await CartService.updateCartItem(itemId, quantity);
    hub.publish("cartItemUpdated", updatedItem);

    // Re-fetch the cart to ensure data is synchronized
    this.fetchCart();
  } catch (error) {
    hub.publish("cartError", error.message);
  }
}
}

