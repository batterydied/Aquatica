import { MarketplacePage } from "./MarketplacePage.js";
import { hub } from "../../eventhub/EventHub.js";
import { Category } from "../shared/Category.js";
import { AppController } from "../../app/AppController.js";

export class SellProductsPage extends MarketplacePage {
    constructor() {
        super();
        this.curSeller = "1234-5678"; // TODO: get curSeller from auth
        this.curSellerName = "Ocean Wonders";
        this.pageLength = 4, this.end = this.start + this.pageLength;
    }

    render() {
        this.getProdList(); // call to ProductService
        hub.subscribe("retrievedProductsList", (data) => this.setProdList(data)); // callback for eventhub

        const mainPage = super.prepareForRender();

        const categories = super.renderCategoryFilters();
        mainPage.appendChild(categories);

        const searchBar = super.renderSearchBar();
        mainPage.appendChild(searchBar);

        this.renderMarketplace();

        this.marketplace.classList.add("marketplace");

        mainPage.appendChild(this.marketplace);

        return this.container;
    }

    /**
     * Helper method that renders the marketplace. Creates product list and page buttons.
     * Has no return value
     */
    renderMarketplace() {
        super.renderMarketplace();
        const addItem = document.createElement('div');
        addItem.classList.add("add-item")
        
        const addItemLabel = document.createElement('span');
        addItemLabel.classList.add("add-item-label");
        addItemLabel.innerText = "Add New Product...";
        addItem.appendChild(addItemLabel);

        const addItemIcon = document.createElement('img');
        addItemIcon.classList.add("add-item-icon");
        addItemIcon.src = "/assets/plus-icon.svg";
        addItem.appendChild(addItemIcon);

        addItem.addEventListener("click", () => this.addProduct());

        this.marketplace.childNodes[0].appendChild(addItem);
        
        if (this.prodList.length < 1) { // remove no items found text
            this.marketplace.childNodes[1].innerHTML = "";
        }
    }

    /**
     * Sets this.fullProdList and this.prodList to the given list, filters for current seller,
     * calculates brackets and average ratings, and applies sorts and filters.
     * No return value.
     * @param {array} list 
     */
    setProdList(list) {
        this.fullProdList = list.filter(e => e.sellerid === this.curSeller);
        this.prodList = this.fullProdList;
        // price brackets and ratings aren't included in the database, so I quickly calculate them for the filters
        for (let i = 0; i < this.fullProdList.length; i++) {
            this.fullProdList[i].bracket = this.calculateBracket(this.fullProdList[i].price);
            this.fullProdList[i].average_rating = this.calculateAverageRating(this.fullProdList[i].Reviews);
        }
        this.reloadFilters();
        this.applySort();
        this.renderMarketplace();
    }

    /**
     * This method takes a product object and returns a div representing that object's render on the page. Includes edit button
     * @param {{ prodname, name, sellerid, sellername, category, price, description, images: [{url}...], reviews: [{rating}...] }} prodListItem 
     * @returns div Element
     */
    createProduct(prodListItem) {
        const product = super.createProduct(prodListItem);
        const editButton = document.createElement('img');
        editButton.classList.add("edit-button");
        editButton.src = "/assets/edit-icon.svg";
        editButton.addEventListener("click", () => this.goToProductPage(prodListItem.prodid));
        product.childNodes[1].appendChild(editButton);

        const deleteButton = document.createElement("img");
        deleteButton.classList.add("edit-button");
        deleteButton.src = "/assets/edit-icon.svg"; //TODO: change to delete icon
        deleteButton.addEventListener("click", () => this.deleteProduct(prodListItem.prodid));
        product.childNodes[1].appendChild(deleteButton);

        return product;
    }

    /**
     * Adds a new product to the database, and navigates to the seller product page for that product.
     * No return value.
     */
    async addProduct() {
        const newProduct = {
            "name": "New Product",
            "sellerid": this.curSeller,
            "sellername": this.curSellerName,
            "category": Category.Misc,
            "description": "Product Description",
            "price": 1,
            "images": [],
        };

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) {
                throw new Error("Failed to add product.");
            }
            const product = await response.json();
            const prodid = product.prodid;
            this.goToProductPage(prodid);
        } catch (error) {
            console.log("Error adding product" + error);
            alert("Failed to add product.");
        }
    }

    /**
     * Deletes the product with the given id from the database, and reloads the page.
     * @param {string} prodid 
     * No return value.
     */
    async deleteProduct(prodid) {
        try {
            const response = await fetch(`/api/products/${prodid}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Failed to delete product.");
            }
            this.render();
        } catch (error) {
            console.log("Error deleting product" + error);
            alert("Failed to delete product.");
        }
    }

    /**
     * Navigates the seller product page for the given product id.
     * @param {string} prodid 
     */
    goToProductPage(prodid) {
        console.log(`going to seller product page for product ${prodid}`);
        const appController = AppController.getInstance();
        appController.navigate("sellerProductPage", {prodid});
    }

    /**
     * Display reviews for the specified product.
     * Goes to product page to show reviews.
     * @param {string} prodid 
     */
    goToReviews(prodid) {
        const appController = AppController.getInstance();
        appController.navigate("productPage", {prodid});
    }
}