import { MarketplacePage } from "./MarketplacePage.js";
import { products } from "./Products.js";

export class SellProductsPage extends MarketplacePage {
    constructor() {
        super();
        this.curSeller = 7905; // to be changed
        this.pageLength = 4, this.end = this.start + this.pageLength;
    }

    getProdList() {
        const list = products.filter(e => e.sellerid === this.curSeller);
        
        for (let i = 0; i < list.length; i++) {
            list[i].bracket = this.calculateBracket(list[i].price);
        }
 
        return list;
    }

    render() {
        this.container.innerHTML = "";

        this.fullProdList = this.getProdList();
        this.prodList = this.fullProdList;

        this.container = super.render();

        const addItem = document.createElement('div');
        addItem.classList.add("add-item")
        
        const addItemLabel = document.createElement('span');
        addItemLabel.classList.add("add-item-label");
        addItemLabel.innerText = "Add New Product...";
        addItem.appendChild(addItemLabel);

        const addItemIcon = document.createElement('img');
        addItemIcon.classList.add("add-item-icon");
        addItemIcon.src = "/frontend/assets/plus-icon.svg";
        addItem.appendChild(addItemIcon);

        addItem.addEventListener("click", () => {
            console.log("*takes you to a new product page*");
        })

        this.marketplace.childNodes[0].appendChild(addItem);
        
        if (this.prodList.length < 1) { // remove no items found text
            this.marketplace.childNodes[1].innerHTML = "";
        }

        return this.container;
    }

    createProduct(prodListItem) {
        const product = super.createProduct(prodListItem);
        const editButton = document.createElement('img');
        editButton.classList.add("edit-button");
        editButton.src = "/frontend/assets/edit-icon.svg";
        editButton.addEventListener("click", () => {
            console.log(`*takes you to the product page for product ${prodListItem.prodid}*`);
        });
        product.childNodes[1].appendChild(editButton);
        return product;
    }
}