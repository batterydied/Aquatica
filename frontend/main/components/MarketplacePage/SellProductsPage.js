import { MarketplacePage } from "./MarketplacePage.js";
import { hub } from "../../eventhub/EventHub.js";
import { Category } from "../shared/Category.js";

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

    createProduct(prodListItem) {
        const product = super.createProduct(prodListItem);
        const editButton = document.createElement('img');
        editButton.classList.add("edit-button");
        editButton.src = "/assets/edit-icon.svg";
        editButton.addEventListener("click", () => this.goToProductPage(prodListItem.prodid));
        product.childNodes[1].appendChild(editButton);
        return product;
    }

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

        const response = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
            throw new Error("Failed to add product.");
        } else {
            const product = await response.json();
            const prodid = product.prodid;
            this.goToProductPage(prodid);
        }
    }

    goToProductPage(prodid) {
        console.log(`going to seller product page for product ${prodid}`);
        // const appController = AppController.getInstance();
        // appController.navigate("productPage", {prodid});
        // TODO: go to seller product page
    }
}