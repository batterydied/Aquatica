import { productData } from '../../tests/mock_data/product_page_mock_data.js';
import StyleSheet from '../../functions/MakeStyleSheetLink.js';
export default function ProductPage() {

    document.head.appendChild(StyleSheet('./css/ProductPage.css'));

    document.head.appendChild(StyleSheet('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Itim&family=McLaren&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet'));

    document.head.appendChild(StyleSheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'));

    const container = document.createElement('div');
    container.className = 'product-page';

    // Title
    const title = document.createElement('h1');
    title.innerText = productData.product.name;
    title.className = 'product-title';

    const secondaryTitle = document.createElement('h2');
    secondaryTitle.innerText = productData.product.scientificName;
    secondaryTitle.className = 'product-secondary-title';

    // Image Gallery
    const imageGallery = document.createElement('div');
    imageGallery.className = 'image-gallery';
    productData.product.images.forEach((imageUrl) => {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `${productData.product.name} thumbnail image`;
        img.className = 'thumbnail-img';
        imageGallery.appendChild(img);
    });

    // Description
    const description = document.createElement('p');
    description.innerText = productData.product.description;
    description.className = 'product-description';

    // Price and Product Types
    const productTypes = document.createElement('div');
    productTypes.className = 'product-types';
    
    const priceLabel = document.createElement('p');
    priceLabel.innerText = `Price: $${productData.product.selectedProductType.price.toFixed(2)}`;
    priceLabel.className = 'product-price';

    const typeDropdown = document.createElement('select');
    typeDropdown.className = 'type-dropdown';
    productData.product.productTypes.forEach((type) => {
        const option = document.createElement('option');
        option.value = type.type;
        option.innerText = `${type.type} - $${type.price.toFixed(2)}`;
        typeDropdown.appendChild(option);
    });

    typeDropdown.value = productData.product.selectedProductType.type;
    typeDropdown.addEventListener('change', (e) => {
        const selectedType = productData.product.productTypes.find(
            (type) => type.type === e.target.value
        );
        priceLabel.innerText = `Price: $${selectedType.price.toFixed(2)} (${selectedType.type})`;
    });

    productTypes.appendChild(priceLabel);
    productTypes.appendChild(typeDropdown);

    // Specifications
    const specifications = document.createElement('ul');
    specifications.className = 'product-specifications';
    Object.entries(productData.product.specifications).forEach(([key, value]) => {
        const specItem = document.createElement('li');
        specItem.innerText = `${key}: ${value}`;
        specifications.appendChild(specItem);
    });

    // Shipping Info
    const shippingInfo = document.createElement('p');
    shippingInfo.innerText = `Shipping: ${productData.product.shippingInfo.shippingCost}, Delivery: ${productData.product.shippingInfo.deliveryTime}`;
    shippingInfo.className = 'shipping-info';
    

    const reviewsAndRatings = document.createElement('div');
    reviewsAndRatings.className = 'reviewsAndRatings';

    const reviewsTitle = document.createElement('div');
    reviewsTitle.innerText = `Reviews (${productData.product.reviewsCount}) ${productData.product.rating}`;
    reviewsTitle.className = 'reviewsTitle';

    const starsContainer = document.createElement('div'); 
    starsContainer.className = 'stars';

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = i <= Math.floor(productData.product.rating) ? 'fas fa-star' : 'far fa-star';
        starsContainer.appendChild(star);
    }

    reviewsTitle.appendChild(starsContainer);

    const customerReviews = document.createElement('div');
    productData.product.reviews.forEach(review => {
        const rev = document.createElement('div');
        rev.className = 'review'; 

        const userStarsDate = document.createElement('div');
        userStarsDate.className = 'userStarsDate';
        const userStars = document.createElement('div');

        const user = document.createElement('div');
        user.className = 'user';
        user.innerText = `${review.user}`;
        userStars.appendChild(user);



        const revStarsContainer = document.createElement('div'); 
        revStarsContainer.className = 'stars';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = i <= Math.floor(review.rating) ? 'fas fa-star' : 'far fa-star';
            revStarsContainer.appendChild(star);
        }
        userStars.appendChild(revStarsContainer);

        const date = document.createElement('div');
        date.className = 'date';
        date.innerText = `${review.date}`;
        userStarsDate.appendChild(userStars);
        userStarsDate.appendChild(date);


        const comment = document.createElement('div');
        comment.className = 'comment';
        comment.innerText = `${review.comment}`;
        rev.appendChild(userStarsDate);
        rev.appendChild(comment);

        customerReviews.appendChild(rev);
    });
    customerReviews.className = 'reviews';

    reviewsAndRatings.appendChild(reviewsTitle);
    reviewsAndRatings.appendChild(customerReviews);

    // Add elements to container
    container.appendChild(title);
    container.appendChild(secondaryTitle);
    container.appendChild(imageGallery);
    container.appendChild(description);
    container.appendChild(productTypes);
    container.appendChild(specifications);
    container.appendChild(shippingInfo);
    container.appendChild(reviewsAndRatings);

    return container;
}

