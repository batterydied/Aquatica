// main product list rendering
const page = document.getElementById('app'); // div that contains all content
// page has navbar at the top, then the list of products, then buttons to change pages at the bottom.

const marketplace = document.createElement('div');
marketplace.classList.add('marketplace');
page.appendChild(marketplace);

const prodlist = [
    {prodid: 1, 
        imgurl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg", 
        name: "Gravel", 
        average_rating: 3.5, 
        numreviews: 10, 
        price: 10.00}, 
    {prodid: 2, 
        imgurl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg", 
        name: "Kelp", 
        average_rating: null, 
        numreviews: 0, 
        price: 19.99}
]; // will eventually be fetched from server, this is just test data

let start = 0, end = 9;

function renderPage() {
    for (let i = start; i < end && i < prodlist.length; i++) {
        // create html to display product
        const curProduct = document.createElement('div');
        curProduct.classList.add('product');
        // etc...

        marketplace.appendChild(curProduct);
    }
}

const nextPage = document.createElement('button');
nextPage.classList.add('page-button');
nextPage.id = 'next-page-button';
nextPage.addEventListener('click', () => {
    if (end < prodlist.length - 1) {
        start += 10;
        end += 10;
        renderPage();
    }
})

const prevPage = document.createElement('button');
prevPage.classList.add('page-button');
prevPage.id = 'prev-page-button';
prevPage.addEventListener('click', () => {
    if (start >= 10) {
        start -= 10;
        end -= 10;
        renderPage();
    }
})

renderPage();
page.appendChild(nextPage);
page.appendChild(prevPage);

// TODO: implement the following:

// list of objects of the form
// {prodid, imgurl, name, average rating, numreviews, price}
// eg. {1, https://gravel.png, "Gravel", 3.5, 10, 10.00}, {2, https://kelp.png, "Kelp", null, 0, 19.99}
// prodid is not displayed, just an internal way to keep track of products

// a default 0, b default 9
// for (products a - b in product list)
//      create html to display the product

//           should look something like:
//           <div class="product">
//              <div class="prodimg">
//                  <img src=imgurl></img>
//              </div>
//              <div class="proddesc">
//                  <a href=[link to product page]>name</a>
//                  <img src=[starratingicon]></img>
//                  <a href=[link to ratings]>numreviews</a>
//                  <p>$price</p>
//              </div>
//           </div>

//      add to dom

// button to increase a and b by 10 (next page) or decrease a and b by 10 (previous page)

// sort and filter
// TODO: future feature

// browse categories
// TODO: future feature