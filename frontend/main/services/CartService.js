import { Service } from "./Service.js";

export class CartService extends Service {
  constructor() {
    super();
    this.dbName = "cartDB";
    this.storeName = "cartItems";
    this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = () => {
        reject("Error initializing IndexedDB for CartService");
      };
    });
  }

  async saveCartItem(item) {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], "readwrite");
      const store = tx.objectStore(this.storeName);
      const request = store.put(item); // `put` ensures upsert behavior

      request.onsuccess = () => {
        this.publish("saveCartItemSuccess", item);
        resolve("Successfully saved cart item");
      };

      request.onerror = () => {
        this.publish("saveCartItemError", item);
        reject("Failed to save cart item");
      };
    });
  }

  async retrieveCartItems() {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], "readonly");
      const store = tx.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = (event) => {
        const items = event.target.result;
        this.publish("retrievedCartItems", items);
        resolve(items);
      };

      request.onerror = () => {
        this.publish("retrieveCartItemsError");
        reject("Failed to retrieve cart items");
      };
    });
  }

  async deleteCartItem(id) {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], "readwrite");
      const store = tx.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        this.publish("deleteCartItemSuccess", id);
        resolve(`Successfully deleted item with id ${id}`);
      };

      request.onerror = () => {
        this.publish("deleteCartItemError", id);
        reject("Failed to delete cart item");
      };
    });
  }

  async clearCart() {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], "readwrite");
      const store = tx.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        this.publish("clearCartSuccess");
        resolve("Cart cleared successfully");
      };

      request.onerror = () => {
        this.publish("clearCartError");
        reject("Failed to clear cart");
      };
    });
  }
}

