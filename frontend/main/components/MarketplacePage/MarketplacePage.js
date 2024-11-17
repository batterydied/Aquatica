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

        this.prodList = this.fullProdList; // to be changed with search/filter
        this.curCategory = "All";
        this.curBracket = "All";
        this.regex = /(?:)/gi;
        
        this.sort = Sorts.Good;
        this.applySort();

        this.start = 0, this.end = 5;
        this.loadCSS("MarketplacePage");
    }

    getProdList() { // TODO: will be async
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
        //background image and logo
        const bg = document.createElement("div");
        bg.classList.add("background");
        const bgimg = document.createElement("img");
        bgimg.classList.add("bgimg");
        bgimg.src = "../frontend/assets/bg-dummy.png"; // TODO: site main image
        bg.appendChild(bgimg);
        const iconContainer = document.createElement("div");
        iconContainer.classList.add("icon-container");
        const icon = document.createElement("img");
        icon.src = "../frontend/assets/logo-dummy.png"; // TODO: icon
        icon.classList.add("icon");
        iconContainer.appendChild(icon);
        bg.appendChild(iconContainer);
        this.container.appendChild(bg);

        const mainPage = document.createElement("div");
        mainPage.classList.add("main-page");
        this.container.appendChild(mainPage);

        // filtering
        const categoryBox = document.createElement("div");
        categoryBox.classList.add("category-box");
        categoryBox.classList.add("filters");
        mainPage.appendChild(categoryBox);

        const categoryFilter = document.createElement("button");
        categoryFilter.classList.add("filter-label");
        categoryFilter.innerText = "Categories:";
        categoryBox.appendChild(categoryFilter);

        const allButton = document.createElement("button");
        allButton.innerText = "All";
        allButton.classList.add("filter-button");
        allButton.classList.add("category-button");
        allButton.id = "all-button";
        allButton.addEventListener("click", () => {
            if (this.curCategory !== "All") {
                this.curCategory = "All";
                this.reloadFilters();
                this.renderMarketplace();
                this.reStyleButtons("category-button");
            }
        });
        categoryBox.appendChild(allButton);

        for (let category in Category) {
            const button = this.createFilterButton("category", Category[category]);
            button.id = Category[category];
            categoryBox.appendChild(button);
        }

        const priceBox = document.createElement("div");
        priceBox.classList.add("price-box");
        priceBox.classList.add("filters");
        mainPage.appendChild(priceBox);

        const priceFilter = document.createElement("button");
        priceFilter.classList.add("filter-label");
        priceFilter.innerText = "Price:";
        priceBox.appendChild(priceFilter);

        for (let bracket in PriceBrackets) {
            const bracketButton = this.createFilterButton("bracket", PriceBrackets[bracket]);
            bracketButton.id = PriceBrackets[bracket];
            priceBox.appendChild(bracketButton);
        }

        // search bar
        const searchBar = document.createElement("div");
        searchBar.classList.add("search-bar");
        
        const searchIcon = document.createElement("img");
        searchIcon.src = "/frontend/assets/search-icon.png";
        searchIcon.classList.add("search-icon");
        searchBar.appendChild(searchIcon);

        const searchInput = document.createElement("input");
        searchInput.classList.add("search-input");
        searchInput.type = "text";
        searchInput.placeholder = "Search_"
        searchInput.addEventListener("keyup", () => {
            this.regex = new RegExp(searchInput.value, "ig");
            this.reloadFilters();
            this.renderMarketplace();
        });
        searchBar.appendChild(searchInput);
        mainPage.appendChild(searchBar);

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

        mainPage.appendChild(sorter);

        this.renderMarketplace();

        this.marketplace.classList.add("marketplace");

        mainPage.appendChild(this.marketplace);

        return this.container;
    }

    renderMarketplace() {
        // empty marketplace
        this.marketplace.innerHTML = "";
        // render products list
        for (let i = this.start; i < this.end && i < this.prodList.length; i++) {
            // create html to display product
            const curProduct = document.createElement('div');
            curProduct.classList.add('product');

            const prodIMGDiv = document.createElement("div");
            prodIMGDiv.classList.add("prodimg-container");
            curProduct.appendChild(prodIMGDiv);

            const prodIMG = document.createElement("img");
            prodIMG.src = "/frontend/assets/dummy_600x400_ffffff_cccccc.png";
            prodIMG.classList.add("prodimg");
            //prodIMG.src = this.prodList[i].imgurl;
            prodIMGDiv.appendChild(prodIMG);

            const prodDesc = document.createElement("div");
            prodDesc.classList.add("proddesc");
            curProduct.appendChild(prodDesc);

            const prodInfo = document.createElement('div');
            prodInfo.classList.add("prodinfo");
            prodDesc.appendChild(prodInfo);

            const price = document.createElement("span");
            price.classList.add("price");
            price.classList.add("prodtext");
            price.innerText = `$${this.prodList[i].price}\n`; // make sure it displays with two decimal places
            prodInfo.appendChild(price);

            const prodName = document.createElement("span");
            prodName.classList.add("prodname");
            const prodLink = document.createElement("a");
            prodLink.classList.add("prodtext");
            prodLink.classList.add("prodlink");
            prodLink.innerText = this.prodList[i].name + '\n';
            prodLink.href = ""; // will be link to seller profile page
            prodName.appendChild(prodLink);
            // TODO: needs to tell AppController to open product page and what productid to load
            prodInfo.appendChild(prodName);

            const sellName = document.createElement("span");
            sellName.classList.add("sellname");
            const sellLink = document.createElement("a");
            sellLink.classList.add("prodtext");
            sellLink.classList.add("prodlink");
            sellLink.innerText = this.prodList[i].sellername;
            sellLink.href = ""; // will be link to seller profile page
            sellName.appendChild(sellLink);
            // TODO: tell AppController to open profile page and what sellerid to load
            prodInfo.appendChild(sellName);

            if (this.prodList[i].numreviews > 0 && this.prodList[i].average_rating !== null) {
                const starIMGDiv = document.createElement("div");
                starIMGDiv.classList.add("stars-container");
                prodInfo.appendChild(starIMGDiv);

                const starIMG = document.createElement("img");
                starIMG.classList.add("stars");
                starIMG.src = this.getStarIMG(this.prodList[i].average_rating); // star image based on rating
                starIMG.alt = `${this.prodList[i].average_rating.toPrecision(2)} Stars`;
                starIMGDiv.appendChild(starIMG);

                const starText = document.createElement("span");
                starText.classList.add("star-text");
                starText.innerText = `${this.prodList[i].average_rating} Stars`;
                starIMGDiv.appendChild(starText);

                const numReviews = document.createElement("a");
                numReviews.classList.add("reviews-text");
                numReviews.classList.add("prodlink");
                numReviews.href = ""
                // TODO: tell AppController to open ratings page and what productid to load

                const reviews = this.prodList[i].numreviews === 1 ? "Review" : "Reviews";
                numReviews.innerText = ` ${this.prodList[i].numreviews} ${reviews}\n`;
                prodInfo.appendChild(numReviews);
            } else {
                const noRatingText = document.createElement("span");
                noRatingText.classList.add("reviews-text");
                noRatingText.innerText = "No reviews.\n";
                prodInfo.appendChild(noRatingText);
            }

            const desc = document.createElement("span");
            desc.classList.add("desc");
            desc.innerText = this.prodList[i].description;
            prodDesc.appendChild(desc);

            this.marketplace.appendChild(curProduct);
        }

        if (this.prodList.length > 0) {
            // render page buttons and page number
            const pageBox = document.createElement("div");
            pageBox.classList.add("page-box");

            const nextPage = document.createElement('div');

            const nextPageIMG = document.createElement('img');
            nextPageIMG.classList.add("page-img");
            nextPageIMG.src = "/frontend/assets/next-page.png";
            nextPage.appendChild(nextPageIMG);

            nextPage.classList.add('page-button');
            nextPage.addEventListener('click', () => {
                if (this.end < this.prodList.length - 1) {
                    this.start += 5;
                    this.end += 5;
                    this.renderMarketplace();
                }
            })

            const pageNumber = document.createElement('p');
            const endItem = Math.min(this.end, this.prodList.length);
            pageNumber.innerText = `${this.start + 1} - ${endItem} / ${this.prodList.length}`;

            const prevPage = document.createElement('div');

            const prevPageIMG = document.createElement('img');
            prevPageIMG.classList.add("page-img");
            prevPageIMG.src = "/frontend/assets/prev-button.png";
            prevPage.appendChild(prevPageIMG);

            prevPage.classList.add('page-button');
            prevPage.addEventListener('click', () => {
                if (this.start >= 5) {
                    this.start -= 5;
                    this.end -= 5;
                    this.renderMarketplace();
                }
            })
            pageBox.appendChild(prevPage);
            pageBox.appendChild(pageNumber);
            pageBox.appendChild(nextPage);

            this.marketplace.appendChild(pageBox);
        } else {
            const noItemsFound = document.createElement("span");
            noItemsFound.innerText = "No items found for current criteria. Try other search terms.";
            this.marketplace.appendChild(noItemsFound);
        }
    }

    createFilterButton(kind, text) {
        const button = document.createElement("button");
        button.classList.add("filter-button");
        const buttonClass = `${kind}-button`;
        button.classList.add(buttonClass);
        button.textContent = text;

        button.addEventListener("click", () => {
            const toggle = kind === "category" ? this.curCategory : this.curBracket;
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
            this.reStyleButtons(buttonClass);
        });
        return button;
    }

    applyFilter(cond) {
        this.prodList = this.prodList.filter(cond);
    }

    reloadFilters() {
        this.prodList = this.fullProdList;
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
                this.prodList.sort((a, b) => b.price - a.price);
                break;
            case Sorts.Cheap:
                this.prodList.sort((a, b) => a.price - b.price);
                break;
            case Sorts.Good:
                this.prodList.sort((a, b) => b.average_rating - a.average_rating);
                break;
            default:
                console.log("Unknown sort order, defaulting to ID");
                this.prodList.sort((a, b) => a.prodid - b.prodid);
        }
        this.start = 0;
        this.end = 5;
    }

    reStyleButtons(buttonClass) {
        const buttons = document.querySelectorAll(`.${buttonClass}`);
        console.log(buttonClass);
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.backgroundColor = "#FFFFFF";
            buttons[i].style.color = "#232C3C";
        }
        if (this.curCategory === "All") {
            const allButton = document.getElementById("all-button");
            allButton.style.backgroundColor = "#43608D";
            allButton.style.color = "#FFFFFF";
        } else {
            const curButton = document.getElementById(this.curCategory);
            curButton.style.backgroundColor = "#43608D";
            curButton.style.color = "#FFFFFF";
        }
        if (this.curBracket !== "All") {
            const curButton = document.getElementById(this.curBracket);
            curButton.style.backgroundColor = "#43608D";
            curButton.style.color = "#FFFFFF";
        }
    }

    getStarIMG(rating) {
        if (rating < 1.4) {
            return "/frontend/assets/one-star.png";
        } else if (rating < 1.9) {
            return "/frontend/assets/one-point-five-star.png";
        } else if (rating < 2.4) {
            return "/frontend/assets/two-star.png";
        } else if (rating < 2.9) {
            return "/frontend/assets/two-point-five-star.png";
        } else if (rating < 3.4) {
            return "/frontend/assets/three-star.png";
        } else if (rating < 3.9) {
            return "/frontend/assets/three-point-five-star.png";
        } else if (rating < 4.4) {
            return "/frontend/assets/four-star.png";
        } else if (rating < 4.9) {
            return "/frontend/assets/four-point-five-star.png";
        } else {
            return "/frontend/assets/five-star.png";
        }
    }
}