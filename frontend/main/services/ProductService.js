import { products } from "../components/MarketplacePage/Products.js";

export class ProductService {
    constructor() {
        this.curProdId = null;
        this.products = [];
    }

    retrieveAllProducts() { // eventually will call server
        this.products = products;
        return this.products;
    }

    getCurProduct() {
        for (let i = 0; i < products.length; i++) {
            if (products[i].prodid === this.curProdId) {
                return products[i];
            }
        }
        return null;
    }

    static getInstance() {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService;
        }
        return ProductService.instance;
    }
}