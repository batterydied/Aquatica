import { BaseComponent } from "../../app/BaseComponent";

export class MarketplacePage extends BaseComponent {
    // main product list rendering
    // list of products at the top, then buttons to change pages at the bottom.

    constructor() {
        super();
        this.container.classList.add('marketplace-page');
        this.marketplace = document.createElement('div');
        this.marketplace.classList.add('marketplace');
        this.fullProdList = this.getProdList;

        // will be changed with search/filter, need to keep track of full original list :)
        this.prodlist = this.fullProdList;

        this.start = 0, this.end = 5;
    }

    getProdList() { // will be async
        return [
            {prodid: 1, 
            sellername: "Neuvillette",
            sellerid: 1,
            imgurl: "../../assets/dummy_600x400_ffffff_cccccc.png", 
            name: "Water", 
            description: "Water comes in many flavors to the discerning palate. Mondstadt's water is crisp and pure, while water from Liyue has an enduring aftertaste. In Inazuma, the water possesses a depth of flavor unlike any other. Sumeru's water, meanwhile, has a rich and complex flavor profile, but it must be savored patiently to fully appreciate it.",
            average_rating: 3.5, 
            numreviews: 10, 
            price: 10.00}, 
            {prodid: 2, 
            sellername: "Seller 2",
            sellerid: 2,
            imgurl: "../../assets/dummy_600x400_ffffff_cccccc.png", 
            name: "Kelp", 
            description: "Kelp mmm tastey :)",
            average_rating: null, 
            numreviews: 0, 
            price: 19.99}
        ]; // will eventually be fetched from server, this is just test data
    }

    render() {
        // empty previous render if any
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
            prodIMG.src = this.prodlist[i].imgurl;
            prodIMGDiv.appendChild(prodIMG);

            const prodDesc = document.createElement("div");
            prodDesc.classList.add("proddesc");
            curProduct.appendChild(prodDesc);

            const prodName = document.createElement("a");
            prodName.innerText = this.prodlist[i].name;
            prodName.href = ""; // will be link to product page
            prodDesc.appendChild(prodName);

            const sellName = document.createElement("a");
            sellName.innerText = this.prodlist[i].sellername;
            sellName.href = ""; // will be link to product page
            prodDesc.appendChild(sellName);

            if (this.prodlist[i].numreviews > 0 && this.prodlist[i].average_rating !== null) {
                const starIMG = document.createElement("img");
                starIMG.src = ""; // star image based on rating
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

            this.marketplace.appendChild(curProduct);
        }

        // render page buttons and page number
        const nextPage = document.createElement('button');
        nextPage.classList.add('page-button');
        nextPage.id = 'next-page-button';
        nextPage.addEventListener('click', () => {
            if (this.end < this.prodlist.length - 1) {
                this.start += 5;
                this.end += 5;
                this.render();
            }
        })

        const pageNumber = document.createElement('p');
        pageNumber.innerText = `${this.start + 1} - ${this.end + 1} / ${this.prodlist.length}`;

        const prevPage = document.createElement('button');
        prevPage.classList.add('page-button');
        prevPage.id = 'prev-page-button';
        prevPage.addEventListener('click', () => {
            if (this.start >= 5) {
                this.start -= 5;
                this.end -= 5;
                this.render();
            }
        })

        this.container.appendChild(nextPage);
        this.container.appendChild(pageNumber);
        this.container.appendChild(prevPage);

        return this.container;
    }

    // sort and filter
    // TODO: future feature

    // browse categories
    // TODO: future feature
}