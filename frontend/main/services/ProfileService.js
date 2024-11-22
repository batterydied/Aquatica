import { Service } from "./Service.js";

export class ProfileService extends Service {
    constructor() {
        super();
        this.dbName = "profileDB";
        this.storeName = "profiles";
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

            request.onerror = (event) => {
                reject("Error initializing IndexedDB for ProfileService");
            };
        });
    }

    async saveProfile(profile) {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction([this.storeName], "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.put(profile);

            request.onsuccess = () => {
                this.publish("saveProfileSuccess", profile);
                resolve("Profile saved successfully");
            };

            request.onerror = (event) => {
                this.publish("saveProfileError", profile);
                reject("Failed to save profile");
            };
        });
    }

    async retrieveProfileById(id) {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction([this.storeName], "readonly");
            const store = tx.objectStore(this.storeName);
            const request = store.get(id);

            request.onsuccess = (event) => {
                const profile = event.target.result;
                this.publish("retrievedProfile", profile);
                resolve(profile);
            };

            request.onerror = (event) => {
                this.publish("retrieveProfileError", id);
                reject(`Failed to retrieve profile with id ${id}`);
            };
        });
    }

    async deleteProfile(id) {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction([this.storeName], "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.delete(id);

            request.onsuccess = () => {
                this.publish("deleteProfileSuccess", id);
                resolve(`Profile with id ${id} deleted successfully`);
            };

            request.onerror = (event) => {
                this.publish("deleteProfileError", id);
                reject(`Failed to delete profile with id ${id}`);
            };
        });
    }

    async clearProfiles() {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction([this.storeName], "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => {
                this.publish("clearProfilesSuccess");
                resolve("All profiles cleared successfully");
            };

            request.onerror = (event) => {
                this.publish("clearProfilesError");
                reject("Failed to clear profiles");
            };
        });
    }
}
