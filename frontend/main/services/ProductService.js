import { Service } from "./Service.js";
export class ProductService extends Service {
    constructor() {
        super();
        this.controller = ProductController;
    }

    async retrieveAllProducts() {
        const response = await fetch("/products", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to retrieve products.");
        }

        this.publish("retrievedProductsList", response.products);
    }
}