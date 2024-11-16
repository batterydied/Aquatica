import { BaseComponent } from "../../app/BaseComponent.js";
import { Category } from "../shared/Category.js";
import { PriceBrackets } from "./PriceBrackets.js";
import { Sorts } from "./Sorts.js";
import { products } from "./Products.js";

export class MarketplacePage extends BaseComponent {
    constructor() {
        super();
        this.container.classList.add('marketplace-page');
        this.fullProdList = this.getProdList();
        this.marketplace = document.createElement("div");

        this.prodlist = this.fullProdList; // to be changed with search/filter
        this.curCategory = "All";
        this.curBracket = "All";
        this.regex = /(?:)/gi;
        
        this.sort = Sorts.Good;
        this.applySort();

        this.start = 0, this.end = 5;
    }

    getProdList() { // will be async
        const list = products; // will eventually be fetched from server, this is just test data

        for (let i = 0; i < list.length; i++) {
            list[i].bracket = this.calculateBracket(list[i].price);
        }

        return list;
    }

    calculateBracket(price) {
        if (price < 20) {
            return PriceBrackets.bracket1;
        } else if (price < 50) {
            return PriceBrackets.bracket2;
        } else if (price < 100) {
            return PriceBrackets.bracket3;
        } else if (price < 500) {
            return PriceBrackets.bracket4;
        } else if (price < 1000) {
            return PriceBrackets.bracket5;
        } else {
            return PriceBrackets.bracket6;
        }
    }

    render() {
        // filtering
        const filters = document.createElement("div");
        filters.classList.add("filters");
        this.container.appendChild(filters);

        const categoryFilter = document.createElement("div");
        categoryFilter.classList.add("filter-label");
        categoryFilter.innerText = "Categories:";
        filters.appendChild(categoryFilter);

        for (let category in Category) {
            const button = this.createFilterButton("category", Category[category]);
            filters.appendChild(button);
        }

        const priceFilter = document.createElement("div");
        priceFilter.classList.add("filter-label");
        priceFilter.innerText = "Price:";
        filters.appendChild(priceFilter);

        for (let bracket in PriceBrackets) {
            const bracketButton = this.createFilterButton("bracket", PriceBrackets[bracket]);
            filters.appendChild(bracketButton);
        }

        // search bar
        const searchBar = document.createElement("div");
        searchBar.classList.add("search-bar");
        
        const searchIcon = document.createElement("img");
        searchIcon.src = "";
        searchBar.appendChild(searchIcon);

        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.addEventListener("keyup", () => {
            this.regex = new RegExp(searchInput.value, "ig");
            this.reloadFilters();
            this.renderMarketplace();
        });
        searchBar.appendChild(searchInput);
        this.container.appendChild(searchBar);

        // sort
        const sorter = document.createElement("select");
        sorter.classList.add("sorter");

        for (let sortType in Sorts) {
            const option = document.createElement("option");
            option.innerText = Sorts[sortType];
            option.value = Sorts[sortType];
            sorter.appendChild(option);
        }

        sorter.onchange = () => {
            this.sort = sorter.value;
            this.applySort();
            this.renderMarketplace();
        }

        this.container.appendChild(sorter);

        this.renderMarketplace();

        this.container.appendChild(this.marketplace);

        return this.container;
    }

    renderMarketplace() {
        // empty marketplace
        this.marketplace.innerHTML = "";
        // render products list
        for (let i = this.start; i < this.end && i < this.prodlist.length; i++) {
            // TODO: Classes for CSS integration
            // create html to display product
            const curProduct = document.createElement('div');
            curProduct.classList.add('product');

            const prodIMGDiv = document.createElement("div");
            prodIMGDiv.classList.add("prodimg");
            curProduct.appendChild(prodIMGDiv);

            const prodIMG = document.createElement("img");
            //prodIMG.src = this.prodlist[i].imgurl;
            prodIMGDiv.appendChild(prodIMG);

            const prodDesc = document.createElement("div");
            prodDesc.classList.add("proddesc");
            curProduct.appendChild(prodDesc);

            const prodName = document.createElement("a");
            prodName.innerText = this.prodlist[i].name + "\n";
            prodName.href = ""; // will be link to product page
            prodDesc.appendChild(prodName);

            const sellName = document.createElement("a");
            sellName.innerText = this.prodlist[i].sellername + "\n";
            sellName.href = ""; // will be link to product page
            prodDesc.appendChild(sellName);

            if (this.prodlist[i].numreviews > 0 && this.prodlist[i].average_rating !== null) {
                const starIMG = document.createElement("img");
                starIMG.src = ""; // star image based on rating
                starIMG.alt = `${this.prodlist[i].average_rating} Stars`;
                prodDesc.appendChild(starIMG);
                const numReviews = document.createElement("p");

                const reviews = this.prodlist[i].numreviews === 1 ? "Review" : "Reviews";
                numReviews.innerText = `${this.prodlist[i].numreviews} ${reviews}`;
                prodDesc.appendChild(numReviews);
            } else {
                const noRatingText = document.createElement("p");
                noRatingText.innerText = "No reviews.";
                prodDesc.appendChild(noRatingText);
            }

            const price = document.createElement("p");
            price.innerText = `$${this.prodlist[i].price}`; // make sure it displays with two decimal places
            prodDesc.appendChild(price);

            const desc = document.createElement("p");
            desc.innerText = this.prodlist[i].description;
            prodDesc.appendChild(desc);

            this.marketplace.appendChild(curProduct);
        }

        if (this.prodlist.length > 0) {
            // render page buttons and page number
            const nextPage = document.createElement('button');
            nextPage.classList.add('page-button');
            nextPage.id = 'next-page-button';
            nextPage.textContent = "Next";
            nextPage.addEventListener('click', () => {
                if (this.end < this.prodlist.length - 1) {
                    this.start += 5;
                    this.end += 5;
                    this.renderMarketplace();
                }
            })

            const pageNumber = document.createElement('p');
            const endItem = Math.min(this.end, this.prodlist.length);
            pageNumber.innerText = `${this.start + 1} - ${endItem} / ${this.prodlist.length}`;

            const prevPage = document.createElement('button');
            prevPage.classList.add('page-button');
            prevPage.id = 'prev-page-button';
            prevPage.textContent = "Previous";
            prevPage.addEventListener('click', () => {
                if (this.start >= 5) {
                    this.start -= 5;
                    this.end -= 5;
                    this.renderMarketplace();
                }
            })
            this.marketplace.appendChild(nextPage);
            this.marketplace.appendChild(pageNumber);
            this.marketplace.appendChild(prevPage);
        } else {
            const noItemsFound = document.createElement("p");
            noItemsFound.innerText = "No items found for current criteria. Try other search terms.";
            this.marketplace.appendChild(noItemsFound);
        }
    }

    createFilterButton(kind, text) {
        const button = document.createElement("button");
        button.classList.add("filter-button");
        button.textContent = text;

        button.addEventListener("click", () => {
            const toggle = kind === "category" ? this.curCategory : this.curBracket;
            console.log("button clicked!")
            if (toggle !== text) {
                // update toggle
                if (kind === "category") { // i wish JS had pointers *sad C programmer noises*
                    this.curCategory = text;
                } else {
                    this.curBracket = text;
                }
                this.reloadFilters();
                // TODO: add styling
            } else {
                // update toggle
                if (kind === "category") {
                    this.curCategory = "All";
                } else {
                    this.curBracket = "All";
                }
                this.reloadFilters();
            }
            this.renderMarketplace();
        });
        return button;
    }

    applyFilter(cond) {
        this.prodlist = this.prodlist.filter(cond);
    }

    reloadFilters() {
        this.prodlist = this.fullProdList;
        if (this.curCategory !== "All") {
            this.applyFilter((e) => e.category === this.curCategory);
        }
        if (this.curBracket !== "All") {
            this.applyFilter((e) => e.bracket === this.curBracket);
        }
        this.applyFilter((e) => this.regex.test(e.description) || this.regex.test(e.name) || this.regex.test(e.sellername))
        this.start = 0;
        this.end = 5;
    }

    applySort() {
        switch (this.sort) {
            case Sorts.Expensive:
                this.prodlist.sort((a, b) => b.price - a.price);
                break;
            case Sorts.Cheap:
                this.prodlist.sort((a, b) => a.price - b.price);
                break;
            case Sorts.Good:
                this.prodlist.sort((a, b) => b.average_rating - a.average_rating);
                break;
            default:
                console.log("Unknown sort order, defaulting to ID");
                this.prodlist.sort((a, b) => a.prodid - b.prodid);
        }
        this.start = 0;
        this.end = 5;
    }

    // TODO: CSS
}