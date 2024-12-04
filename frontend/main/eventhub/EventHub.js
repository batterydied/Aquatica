class EventHub {
  constructor() {
    this.events = {};
  }

<<<<<<< HEAD
  subscribe(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
=======
  
  subscribe(eventName, callback) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(callback);
  }

  publish(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(data));
>>>>>>> issue-#55-cart-model
    }
    this.events[event].push(listener);
    return () => this.unsubscribe(event, listener);
  }

  publish(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener(data));
  }

  unsubscribe(event, listenerToRemove) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(
      (listener) => listener !== listenerToRemove
    );
  }
}

<<<<<<< HEAD
export default new EventHub(); // Use default export

=======
export const hub = new EventHub();
>>>>>>> issue-#55-cart-model
