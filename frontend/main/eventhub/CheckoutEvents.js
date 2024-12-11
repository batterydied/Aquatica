/*
  OrderEvents: Devin
  Description: This file handles publishing and subscribing to order-related events
               through the EventHub. It acts as a bridge between the OrderService
               and the components that need to react to order actions.
  Issue: #51
  Owner: Devin
  Expected Outcome: A functional event system for managing order-related actions
                    like fetching and adding orders.

  - Method: fetchOrders(): Fetches orders from the backend and notifies listeners.
  - Method: addOrder(): Adds a new order and notifies listeners.
*/

// Imports
import OrderService from '../services/OrderService.js';
import { EventHub, hub } from './EventHub.js';

// OrderEvents Class
export default class OrderEvents {
  /**
   * Fetch all orders and notify listeners.
   */
  static async fetchOrders() {
    try {
      const { orders } = await OrderService.fetchOrders();
      hub.publish('ordersFetched', orders);
    } catch (error) {
      hub.publish('orderError', error.message);
    }
  }

  /**
   * Add a new order and notify listeners.
   */
  static async addOrder(productId) {
    try {
      const newOrder = await OrderService.addOrder(productId);
      hub.publish('orderAdded', newOrder);
    } catch (error) {
      hub.publish('orderError', error.message);
    }
  }
}

