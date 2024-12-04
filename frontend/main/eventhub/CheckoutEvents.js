/*
  OrderEvents: Devin
  Description: This file serves as the EventHub class for handling order-related events.
               It facilitates communication between the frontend components and the backend
               services through a publish-subscribe model.

  Issue: #50
  Owner: Devin
  Expected Outcome: A robust event-driven system for managing order-related operations,
                    including fetching and adding orders, while notifying relevant
                    listeners about updates or errors.

  Interface with OrderService.js to perform API calls for order management.

  - Method: fetchOrders(): Fetches all orders and publishes the 'ordersFetched' event.
  - Method: addOrder(productId): Adds a new order to the backend and publishes the 'orderAdded' event.
*/

// Imports
import OrderService from '../services/OrderService.js';
import { EventHub, hub } from './EventHub.js';

// OrderEvents Class
export default class OrderEvents {
  /**
   * Fetch all orders and notify listeners through the 'ordersFetched' event.
   * On failure, publishes the 'orderError' event with the error message.
   */
  static async fetchOrders() {
    try {
      const { orders } = await OrderService.fetchOrders(); // API call to fetch orders
      hub.publish('ordersFetched', orders); // Publish successful fetch
    } catch (error) {
      hub.publish('orderError', error.message); // Publish error event
    }
  }

  /**
   * Add a new order and notify listeners through the 'orderAdded' event.
   * On failure, publishes the 'orderError' event with the error message.
   * 
   * @param {string} productId - The ID of the product to be added as an order.
   */
  static async addOrder(productId) {
    try {
      const newOrder = await OrderService.addOrder(productId); // API call to add order
      hub.publish('orderAdded', newOrder); // Publish successful addition
    } catch (error) {
      hub.publish('orderError', error.message); // Publish error event
    }
  }
}

