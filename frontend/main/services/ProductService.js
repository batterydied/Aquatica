import { Service } from "./Service.js";

export class ProductService extends Service {
    constructor() {
        super();
    }

    async retrieveAllProducts() {
        const response = await fetch("/api/products", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to retrieve products.");
        }

        console.log(response);

        const products = await response.json();

        this.publish("retrievedProductsList", products);
    }

    addSubscriptions() {
        // TODO: implement this method
    }
}
