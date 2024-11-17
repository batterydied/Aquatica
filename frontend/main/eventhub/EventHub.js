export class EventHub {
  static instance = null;

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
  }

  unsubscribe(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
    }
  }
}

export const hub = new EventHub();

