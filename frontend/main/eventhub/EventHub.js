export class EventHub {
  constructor() {
   if (EventHub.instance) return EventHub.instance;

    this.events = {}; // Event listeners storage
    EventHub.instance = this;
  }

  subscribe(eventName, callback) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(callback);
  }

  publish(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(data));
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


export const hub = new EventHub();

