import { BaseComponent } from "../../app/BaseComponent.js";
import { Category } from "../shared/Category.js";
import { PriceBrackets } from "./PriceBrackets.js";
import { Sorts } from "./Sorts.js";
import { AppController } from "../../app/AppController.js";
import { ProductService} from "../../services/ProductService.js";
import { hub } from "../../eventhub/EventHub.js";

/**
 * The Marketplace Page is the main page of the app. It contains a list of all products available on the site.
 * Features:
 * - Filter: Users can click buttons to apply filters to the marketplace based on price range or category.
 * - Search: Users can search the names, sellers, and descriptions of products to find what they are looking for.
 * - Sort: Users can select between three sorts: Price low to high, price high to low, and highest rated. Highest rated is the default sort.
 * - Pages: Users can view more products by interacting with buttons to see the next/previous 5 products in the list.
 */

export class MarketplacePage extends BaseComponent {
    constructor() {
        super();
        this.container.classList.add('marketplace-page');
        // fullProdList contains the full list of all products available on the app. It is unsorted.
        // prodList contains only the products visible with the current filters, and it is sorted.
        this.fullProdList = []; // initialized to [], will be populated by the callback from getProdList()
        this.prodList = this.fullProdList;

        this.marketplace = document.createElement("div");

        // set filters to defaults
        this.curCategory = "All";
        this.curBracket = "All";
        this.regex = /(?:)/gi; // this regex is used to enable search
        
        // set sort to default
        this.sort = Sorts.Good;
        this.applySort();

        // pageLength can be adjusted
        this.pageLength = 5;
        this.start = 0, this.end = this.start+this.pageLength;
        this.loadCSS("MarketplacePage");
    }

    /** getProdList()
     * This method makes a call to ProductService to retrieve all products from the backend. 
     * Nothing is returned from this method.
    */

    async getProdList() {
        const productService = new ProductService();
        const list = await productService.retrieveAllProducts();
    }

    /**
     * Sets this.fullProdList and this.prodList to the given list, calculates brackets and average ratings, and applies sorts and filters.
     * No return value.
     * @param {array} list 
     */
    setProdList(list) {
        this.fullProdList = list;
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
    * This method takes the price of an item and returns which price bracket it falls into.
    * This allows sorting by price range.
    * @param {number} price 
    * @returns bracket
    */
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
        this.getProdList(); // call to ProductService
        hub.subscribe("retrievedProductsList", (data) => this.setProdList(data)); // callback for eventhub
        
        const mainPage = this.prepareForRender();

        // filtering
        // categoryBox is a container for the category filter buttons
        const categoryBox = this.renderCategoryFilters();
        mainPage.appendChild(categoryBox);

        // this div contains all the buttons for price filtering
        const priceBox = this.renderBracketFilters();
        mainPage.appendChild(priceBox);

        // search bar
        // this div contains the search bar
        const searchBar = this.renderSearchBar();
        mainPage.appendChild(searchBar);

        // sort
        // the sorter is a select element that allows the user to sort by price or rating
        const sorter = document.createElement("select");
        sorter.classList.add("sorter");

        // create options for every sort type
        for (let sortType in Sorts) {
            const option = document.createElement("option");
            option.innerText = Sorts[sortType];
            option.value = Sorts[sortType];
            sorter.appendChild(option);
        }

        // add onchange function
        // this function sorts prodList and re-renders the marketplace
        sorter.onchange = () => {
            this.sort = sorter.value;
            this.applySort();
            this.renderMarketplace();
        }

        mainPage.appendChild(sorter);

        // helper method to render the main product list (marketplace)
        this.renderMarketplace();

        this.marketplace.classList.add("marketplace");

        mainPage.appendChild(this.marketplace);

        return this.container;
    }

    /**
     * Fetches the prodList, subscribes to hub events, creates bg and main page containers
     * @returns the main page div
     */
    prepareForRender() {
        this.container.innerHTML = "";

        // bg is just an empty div that sits underneath the navigation bar.
        // this prevents the navigation bar from overlapping the screen.
        const bg = document.createElement("div");
        this.container.appendChild(bg);

        // this div contains all content in the actual page.
        const mainPage = document.createElement("div");
        mainPage.classList.add("main-page");
        this.container.appendChild(mainPage);

        return mainPage;
    }

    /**
     * Creates the category filter buttons.
     * @returns Div containing all category filter buttons
     */
    renderCategoryFilters() {
        // categoryBox is a container for the category filter buttons
        const categoryBox = document.createElement("div");
        categoryBox.classList.add("category-box");
        categoryBox.classList.add("filters");

        // categoryFilter is a label notifying the user that the following buttons allow them to sort by category
        // it is a button so that it can have the same size and shape as the category buttons
        const categoryFilter = document.createElement("button");
        categoryFilter.classList.add("filter-label");
        categoryFilter.innerText = "Categories:";
        categoryBox.appendChild(categoryFilter);

        // the 'All' category has its own special button. It is enabled by default and allows products from all categories to be displayed.
        const allButton = document.createElement("button");
        allButton.innerText = "All";
        allButton.classList.add("filter-button");
        allButton.classList.add("category-button");
        allButton.id = "all-button";
        // this event listener changes the current category to all, and refilters prodList accordingly.
        // It then rerenders the marketplace and updates the styling of the other buttons to ensure no two buttons are enabled at the same time.
        allButton.addEventListener("click", () => {
            if (this.curCategory !== "All") {
                this.curCategory = "All";
                this.reloadFilters();
                this.applySort();
                this.renderMarketplace();
                this.reStyleButtons("category-button");
            }
        });
        categoryBox.appendChild(allButton);

        // create a button for each category
        for (let category in Category) {
            const button = this.createFilterButton("category", Category[category]);
            button.id = Category[category];
            categoryBox.appendChild(button);
        }

        return categoryBox;
    }

    /**
     * Creates the price bracket filter buttons.
     * @returns Div containing all bracket filter buttons
     */
    renderBracketFilters() {
        // this div contains all the buttons for price filtering
        const priceBox = document.createElement("div");
        priceBox.classList.add("price-box");
        priceBox.classList.add("filters");

        // this "button" is a label to indicate to the user that the following buttons filter the products.
        const priceFilter = document.createElement("button");
        priceFilter.classList.add("filter-label");
        priceFilter.innerText = "Price:";
        priceBox.appendChild(priceFilter);

        // create buttons for each price bracket
        for (let bracket in PriceBrackets) {
            const bracketButton = this.createFilterButton("bracket", PriceBrackets[bracket]);
            bracketButton.id = PriceBrackets[bracket];
            priceBox.appendChild(bracketButton);
        }

        return priceBox;
    }

    /**
     * Creates the search bar and related functionality.
     * @returns Div containing search bar
     */
    renderSearchBar() {
        // this div contains the search bar
        const searchBar = document.createElement("div");
        searchBar.classList.add("search-bar");
        
        // image from bootstrap indicating the input is a search bar
        const searchIcon = document.createElement("img");
        searchIcon.src = "/assets/search-icon.png";
        searchIcon.classList.add("search-icon");
        searchBar.appendChild(searchIcon);

        // the actual search input element
        const searchInput = document.createElement("input");
        searchInput.classList.add("search-input");
        searchInput.type = "text";
        searchInput.placeholder = "Search"
        // this event listener filters prodList based on whatever string the user enters using regex searching.
        // it then re-renders the marketplace.
        searchInput.addEventListener("keyup", () => {
            this.regex = new RegExp(searchInput.value, "ig");
            console.log(this.regex);
            this.reloadFilters();
            this.applySort();
            this.renderMarketplace();
        });
        searchBar.appendChild(searchInput);
        return searchBar;
    }

    /**
     * Helper method that renders the marketplace. Creates product list and page buttons.
     * Has no return value
     */
    renderMarketplace() {
        // empty marketplace
        this.marketplace.innerHTML = "";

        // the sell products page uses this div to contain the add new product button.
        // otherwise it has no purpose
        const dontMindMe = document.createElement('div');
        this.marketplace.appendChild(dontMindMe);

        // render products list
        // we will only render products between start and end
        // if end is greater than the length of prodList, we may render fewer products than the difference between start and end
        for (let i = this.start; i < this.end && i < this.prodList.length; i++) {
            // create html to display product
            const curProduct = this.createProduct(this.prodList[i]);

            this.marketplace.appendChild(curProduct);
        }

        if (this.prodList.length > 0) { // if there are products to display...
            // render page buttons and page number
            // this div contains the page buttons and page number
            const pageBox = document.createElement("div");
            pageBox.classList.add("page-box");

            // this div is the next page 'button'
            const nextPage = document.createElement('div');

            // create image to display the next page icon
            const nextPageIMG = document.createElement('img');
            nextPageIMG.classList.add("page-img");
            nextPageIMG.src = "/assets/next-page.png";
            nextPage.appendChild(nextPageIMG);

            nextPage.classList.add('page-button');
            // add event listener to go to the next page
            nextPage.addEventListener('click', () => this.goToNextPage());

            // this p element shows what page the user is on
            // when displaying the first five elements of ten it shows '1 - 5 / 10' etc.
            const pageNumber = document.createElement('p');
            const endItem = Math.min(this.end, this.prodList.length);
            pageNumber.innerText = `${this.start + 1} - ${endItem} / ${this.prodList.length}`;

            // this div is the previous page 'button'
            const prevPage = document.createElement('div');

            // create image to display the previous page icon
            const prevPageIMG = document.createElement('img');
            prevPageIMG.classList.add("page-img");
            prevPageIMG.src = "/assets/prev-button.png";
            prevPage.appendChild(prevPageIMG);

            prevPage.classList.add('page-button');
            // add event listener to go to the next page
            prevPage.addEventListener('click', () => this.goToPrevPage());
            pageBox.appendChild(prevPage);
            pageBox.appendChild(pageNumber);
            pageBox.appendChild(nextPage);

            this.marketplace.appendChild(pageBox);
        } else { // if there are no products to display...
            // display text telling the user there are no products matching their current filter/search criteria
            const noItemsFound = document.createElement("span");
            noItemsFound.innerText = "No items found for current criteria. Try other search terms.";
            this.marketplace.appendChild(noItemsFound);
        }
    }

    /**
     * This helper method returns a button that will filter the marketplace based on a category or price bracket.
     * 
     * NOTE: This method does not work if it is passed anything other than "category" or "bracket" for kind, 
     * or if it is passed an invalid category or bracket for text! Do not use this method without considering this.
     * 
     * @param {"category" || "button"} kind 
     * @param {string} text 
     * @returns filter button
     */

    createFilterButton(kind, text) {
        // create the button and give it a class and text
        const button = document.createElement("button");
        button.classList.add("filter-button");
        const buttonClass = `${kind}-button`;
        button.classList.add(buttonClass);
        button.textContent = text;

        // this event listener will update the current category or bracket, filter prodList accordingly, 
        // re-render the marketplace, and update which buttons are pressed
        button.addEventListener("click", () => {
            // because this method can be used for either categories or brackets, i created the variable toggle to avoid repetitive code
            // toggle is equal to curCategory if the button is a category button and curBracket if the button is a bracket button
            const toggle = kind === "category" ? this.curCategory : this.curBracket;
            if (toggle !== text) {
                // update toggle
                if (kind === "category") { // i wish JS had pointers *sad C programmer noises*
                    this.curCategory = text;
                } else {
                    this.curBracket = text;
                }
                this.reloadFilters();
            } else {
                // update toggle
                if (kind === "category") {
                    this.curCategory = "All";
                } else {
                    this.curBracket = "All";
                }
                this.reloadFilters();
            }
            this.applySort();
            this.renderMarketplace();
            this.reStyleButtons(buttonClass);
        });
        return button;
    }

    /**
     * This method takes a product object and returns a div representing that object's render on the page.
     * @param {{ prodname, name, sellerid, sellername, category, price, description, images: [{url}...], reviews: [{rating}...] }} prodListItem 
     * @returns div Element
     */
    createProduct(prodListItem) {
        // create html to display product
        const curProduct = document.createElement('div');
        curProduct.classList.add('product');

        // container to hold the image
        const prodIMGDiv = document.createElement("div");
        prodIMGDiv.classList.add("prodimg-container");
        curProduct.appendChild(prodIMGDiv);

        // main image for the product
        const prodIMG = document.createElement("img");
        prodIMG.src = prodListItem.Images?.[0]?.url || '';
        prodIMG.classList.add("prodimg");
        prodIMGDiv.appendChild(prodIMG);

        // container to hold the name, price, rating, and description
        const prodDesc = document.createElement("div");
        prodDesc.classList.add("proddesc");
        curProduct.appendChild(prodDesc);

        // container inside prodDesc to hold name, price, and rating
        const prodInfo = document.createElement('div');
        prodInfo.classList.add("prodinfo");
        prodDesc.appendChild(prodInfo);

        // this span displays the price of the item in USD
        const price = document.createElement("span");
        price.classList.add("price");
        price.classList.add("prodtext");
        price.innerText = `$${prodListItem.price}\n`; // make sure it displays with two decimal places
        prodInfo.appendChild(price);

        // this span displays the name of the product
        const prodName = document.createElement("span");
        prodName.classList.add("prodname");
        prodName.classList.add("prodtext");
        prodName.classList.add("prodlink");
        prodName.innerText = prodListItem.name + '\n';
        // event listener to navigate to the product page for this product if the name is clicked
        prodName.addEventListener("click", () => this.goToProductPage(prodListItem.prodid));
        prodInfo.appendChild(prodName);

        // this span displays the name of the seller
        const sellName = document.createElement("span");
        sellName.classList.add("sellname");
        sellName.classList.add("prodtext");
        sellName.classList.add("prodlink");
        sellName.innerText = prodListItem.sellername;
        // event listener to navigate to the seller page for this product's seller if the name is clicked
        sellName.addEventListener("click", () => this.goToSellerProfile(prodListItem.sellerid));
        prodInfo.appendChild(sellName);

        // find out how many reviews the item has
        const numReviews = prodListItem.Reviews?.length || 0;

        if (numReviews > 0) { // if there are reviews...
            // this container is for the star rating
            const starIMGDiv = document.createElement("div");
            starIMGDiv.classList.add("stars-container");
            prodInfo.appendChild(starIMGDiv);

            // this image displays the rating of the review on a scale of 1-5 stars
            const starIMG = document.createElement("img");
            starIMG.classList.add("stars");
            starIMG.src = this.getStarIMG(prodListItem.average_rating); // star image based on rating
            starIMG.alt = `${prodListItem.average_rating.toPrecision(2)} Stars`;
            starIMGDiv.appendChild(starIMG);

            // text saying how many stars the product has
            const starText = document.createElement("span");
            starText.classList.add("star-text");
            starText.innerText = `${prodListItem.average_rating.toPrecision(2)} Stars`;
            starIMGDiv.appendChild(starText);

            // text displaying how many reviews the product has
            const numReviewsText = document.createElement("span");
            numReviewsText.classList.add("reviews-text");
            numReviewsText.classList.add("prodlink");
            // if you click on the number of reviews, it will direct you to the product page to read the reviews.
            numReviewsText.addEventListener("click", () => this.goToProductPage(prodListItem.prodid));

            const reviews = numReviews === 1 ? "Review" : "Reviews"; // ensure correct grammar
            numReviewsText.innerText = ` ${numReviews} ${reviews}\n`;
            prodInfo.appendChild(numReviewsText);
        } else { // if there are no reviews
            // display text informing the user the product has no reviews
            const noRatingText = document.createElement("span");
            noRatingText.classList.add("reviews-text");
            noRatingText.innerText = "\nNo reviews.\n";
            prodInfo.appendChild(noRatingText);
        }

        // display the description of the product
        const desc = document.createElement("span");
        desc.classList.add("desc");
        desc.innerText = prodListItem.description;
        prodDesc.appendChild(desc);

        return curProduct;
    }

    /**
     * Takes a conditional to filter prodList by and applies that filter.
     * Has no return value.
     * @param {function} cond 
     */
    applyFilter(cond) {
        this.prodList = this.prodList.filter(cond);
    }

    /**
     * Filters prodList based on the current criteria.
     * Has no return value.
     */
    reloadFilters() {
        // reset prodList to fullProdList
        this.prodList = this.fullProdList;
        if (this.curCategory !== "All") { // if category is not 'All', apply filter based on curCategory
            this.applyFilter((e) => e.category === this.curCategory);
        }
        if (this.curBracket !== "All") { // if bracket is not 'All', apply filter based on curBracket
            this.applyFilter((e) => e.bracket === this.curBracket);
        }
        // apply filter based on the current value of the regex
        this.applyFilter((e) => this.regex.test(e.description) || this.regex.test(e.name) || this.regex.test(e.sellername));

        // go back to the first page of products
        this.start = 0;
        this.end = 5;
    }

    /**
     * Sorts prodList based on the current selected sort.
     */
    applySort() {
        switch (this.sort) {
            case Sorts.Expensive:
                // sort higher prices first
                this.prodList.sort((a, b) => b.price - a.price);
                break;
            case Sorts.Cheap:
                // sort lower prices first
                this.prodList.sort((a, b) => a.price - b.price);
                break;
            case Sorts.Good:
                // sort higher ratings fits
                this.prodList.sort((a, b) => b.average_rating - a.average_rating);
                break;
            default:
                // in the case where this.sort is an unknown value, it will default to sorting by average rating
                console.log("Unknown sort order, defaulting to average rating");
                this.prodList.sort((a, b) => b.average_rating - a.average_rating);
        }

        // go back to the first page of products
        this.start = 0;
        this.end = 5;
    }

    /**
     * Resets the specified class of buttons to be white, aside from the currently active filters.
     * @param {"category-button" || "filter-button"} buttonClass
     */
    reStyleButtons(buttonClass) {
        // find all buttons of the specified class
        const buttons = document.querySelectorAll(`.${buttonClass}`);
        // reset their styling to be all white
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.backgroundColor = "#FFFFFF";
            buttons[i].style.color = "#232C3C";
        }
        // style the currently selected category button
        if (this.curCategory === "All") {
            const allButton = document.getElementById("all-button");
            allButton.style.backgroundColor = "#43608D";
            allButton.style.color = "#FFFFFF";
        } else {
            const curButton = document.getElementById(this.curCategory);
            curButton.style.backgroundColor = "#43608D";
            curButton.style.color = "#FFFFFF";
        }
        // style the currently selected bracket button, if any
        if (this.curBracket !== "All") {
            const curButton = document.getElementById(this.curBracket);
            curButton.style.backgroundColor = "#43608D";
            curButton.style.color = "#FFFFFF";
        }
    }

    /**
     * Takes a rating in [1, 5] and returns the corresponding star image.
     * NOTE: This method expects an input in [1, 5]. It will not work correctly if given inputs outside of that range.
     * Ratings are rounded up if they are within 0.1 of the next rating and down otherwise
     * @param {number} rating 
     * @returns image url
     */
    getStarIMG(rating) {
        if (rating < 1.4) {
            return "/assets/one-star.png";
        } else if (rating < 1.9) {
            return "/assets/one-point-five-star.png";
        } else if (rating < 2.4) {
            return "/assets/two-star.png";
        } else if (rating < 2.9) {
            return "/assets/two-point-five-star.png";
        } else if (rating < 3.4) {
            return "/assets/three-star.png";
        } else if (rating < 3.9) {
            return "/assets/three-point-five-star.png";
        } else if (rating < 4.4) {
            return "/assets/four-star.png";
        } else if (rating < 4.9) {
            return "/assets/four-point-five-star.png";
        } else {
            return "/assets/five-star.png";
        }
    }

    calculateAverageRating(reviews) {
        const numReviews = reviews.length;
        let ratingSum = 0;
        for (let i = 0; i < numReviews; i++) {
            ratingSum += reviews[i].rating;
        }

        const averageRating = ratingSum / numReviews;
        return averageRating;
    }
    /**
     * Renders the next page of products.
     */
    goToNextPage() {
        if (this.end < this.prodList.length - 1) { // if there are any more products to display
            // increase start and end by pageLength to go to next "page"
            this.start += this.pageLength;
            this.end += this.pageLength;
            this.renderMarketplace();
        }
    }

    /**
     * Renders the previous page of products
     */
    goToPrevPage() {
        if (this.start >= this.pageLength) { // if we are not already on the first page
            // decrease start and end by pageLength to go to previous "page"
            this.start -= this.pageLength;
            this.end -= this.pageLength;
            this.renderMarketplace();
        }
    }

    /**
     * Navigate to the product page for the specified product.
     * Has no return value.
     * @param {string} prodid 
     */
    goToProductPage(prodid) {
        console.log(`going to product page for product ${prodid}`);
        const appController = AppController.getInstance();
        appController.navigate("productPage", {prodid});
    }

    /**
     * Navigate to the profile page for the specified seller
     * Has no return value.
     * @param {string} sellid 
     */
    goToSellerProfile(sellid) {
        console.log(`going to profile page for seller ${sellid}`);
        const appController = AppController.getInstance();
        appController.navigate("profilePage", sellid);
    }
}
