import { EventHub } from "../eventhub/EventHub";

export class Service {
    constructor() {
        this.addSubscriptions();
    }

    addSubscriptions() {
        throw new error("addSubscriptions not implemented");
    }

    subscribe(event, listener) {
        return hub.subscribe(event, listener);
    }
    
    publish(event, data) {
        hub.publish(event, data);
    }
}