// eventhub/OrderEvents.js
import OrderService from '../services/OrderService.js';
import { EventHub, hub } from './EventHub.js';

export default class OrderEvents {
  // Fetch all orders and notify listeners
  static async fetchOrders() {
    try {
      const { orders } = await OrderService.fetchOrders();
      hub.publish('ordersFetched', orders);
    } catch (error) {
      hub.publish('orderError', error.message);
    }
  }

  // Add an item to the cart and notify listeners
  static async addOrder(productId) {
    try {
      const newOrder = await OrderService.addOrder(productId);
      hub.publish('orderAdded', newOrder);
    } catch (error) {
      hub.publish('orderError', error.message);
    }
  }
}
