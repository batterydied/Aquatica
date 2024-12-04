import { EventHub, hub } from "../eventhub/EventHub.js";

export class Service {
    constructor() {
        this.addSubscriptions();
    }

  addSubscriptions() {
    try {
      // Add your subscription logic here
      console.log("Adding subscriptions...");
    } catch (error) { // Ensure the variable 'error' is defined
      console.error("Error adding subscriptions:", error); // Log the error
      throw error; // Rethrow to propagate the error up
    }
  }

    subscribe(event, listener) {
        return hub.subscribe(event, listener);
    }
    
    publish(event, data) {
        hub.publish(event, data);
    }
}
