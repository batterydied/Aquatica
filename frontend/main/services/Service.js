import { EventHub, hub } from "../eventhub/EventHub.js";

export class Service {
    constructor() {
        this.addSubscriptions();
    }


    addSubscriptions() {
        throw new Error("addSubscriptions not implemented");
    }

    subscribe(event, listener) {
        return hub.subscribe(event, listener);
    }
    
    publish(event, data) {
        hub.publish(event, data);
    }
}
