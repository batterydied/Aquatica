import { products } from "../components/MarketplacePage/Products.js";

export class ProductService extends Service {
    constructor() {
        super();
        this.curProdId = null;
        this.products = [];

        //this.initDB().then(() => this.retrieveAllProducts());
        this.retrieveAllProducts();
    }

    initDB() {
        // create db (not implemented yet)
    }

    saveProduct(product) {
        console.log(`Saving product ${product.prodid}`);
        // save product to db (not implemented yet)
    }

    retrieveAllProducts() {
        this.products = products; // get products from db (not implemented yeet)
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

    addSubscriptions() {
        this.subscribe("saveProduct", (data) => this.saveProduct(data));
        this.subscribe("getCurProduct", () => this.getCurProduct());
        this.subscribe("setCurProduct", (prodid) => {this.curProdId = prodid});
    }
}