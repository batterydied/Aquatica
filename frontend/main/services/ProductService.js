import { products } from "../components/MarketplacePage/Products.js";
import { Service } from "./Service.js";
export class ProductService extends Service {
    constructor() {
        super();
        this.dbName = 'productsDB';
        this.storeName = 'products';

        this.initDB();
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = event => {
                const db = event.target.result;
                db.createObjectStore(this.storeName, {
                  keyPath: 'id',
                  autoIncrement: true,
                });
              };
        
              request.onsuccess = event => {
                this.db = event.target.result;
                resolve(this.db);
              };
        
              request.onerror = event => {
                reject('Error initializing IndexedDB');
              };
        });
    }

    async saveProduct(product) {
        if (!this.db) {
            this.db = await this.initDB();
        }
        console.log(`Saving product ${product.prodid}`);
        const prodData = product;

        return new Promise ((resolve, reject) => {
            const tx = this.db.transaction([this.storeName], "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.add(prodData);

            request.onsuccess = () => {
                this.publish("saveProductSuccess", prodData);
                resolve("Successfully saved product");
            };

            request.onerror = () => {
                this.publish("saveProductError", prodData);
                reject("Failed to save product");
            };
        });
    }

    async retrieveAllProducts() {
        if (!this.db) {
            this.db = await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction([this.storeName], "readonly");
            const store = tx.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = (event) => {
                const retrievedProducts = event.target.result;
                retrievedProducts.forEach(product => this.publish("retrievedProduct", product));
                resolve(retrievedProducts);
            };

            request.onerror = () => {
                this.publish("retrieveProductError");
                reject("Failed to retrieve products");
            }
        });
    }

    async clearProducts() {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const request = store.clear();
    
          request.onsuccess = () => {
            this.publish("clearProductsSuccess");
            resolve('All products cleared');
          };
    
          request.onerror = () => {
            this.publish("clearProductsFailure");
            reject('Error clearing products');
          };
        });
      }

    addSubscriptions() {
        this.subscribe("saveProduct", (data) => this.saveProduct(data));
        this.subscribe("getCurProduct", () => this.getCurProduct());
        this.subscribe("setCurProduct", (prodid) => {this.curProdId = prodid});
    }
}