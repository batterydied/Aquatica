import { MarketplacePage } from "./MarketplacePage.js";

export class SellProductsPage extends MarketplacePage {
    constructor() {
        super();
        this.pageLength = 4, this.end = this.start + this.pageLength;
    }

    render() {
        this.container = super.render();
        const addItem = document.createElement('div');
        addItem.classList.add("add-item")
        
        const addItemLabel = document.createElement('span');
        addItemLabel.classList.add("add-item-label");
        addItemLabel.innerText = "Add New Product...";
        addItem.appendChild(addItemLabel);

        const addItemIcon = document.createElement('img');
        addItemIcon.classList.add("add-item-icon");
        addItemIcon.src = "/frontend/assets/plus-icon.png";
        addItem.appendChild(addItemIcon);

        addItem.addEventListener("click", () => {
            console.log("*takes you to a new product page*");
        })

        this.marketplace.childNodes[0].appendChild(addItem);
        return this.container;
    }

    createProduct(prodListItem) {
        const product = super.createProduct(prodListItem);
        const editButton = document.createElement('img');
        editButton.classList.add("edit-button");
        editButton.src = "/frontend/assets/edit-icon.png";
        editButton.addEventListener("click", () => {
            console.log(`*takes you to the product page for product ${prodListItem.prodid}*`);
        });
        product.childNodes[1].appendChild(editButton);
        return product;
    }
}