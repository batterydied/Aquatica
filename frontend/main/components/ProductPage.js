import { productData } from '../../tests/mock_data/product_page_mock_data.js';
import StyleSheet from '../../functions/MakeStyleSheetLink.js';
import {imgUrl} from '../../tests/mock_data/imgUrl.js'
export default function ProductPage() {
    console.log(imgUrl);
    document.head.appendChild(StyleSheet('./css/ProductPage.css'));

    document.head.appendChild(StyleSheet('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Itim&family=McLaren&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet'));

    const container = document.createElement('div');
    container.className = 'product-page';
    
    const titles = document.createElement('div');
    // Title
    const title = document.createElement('h1');
    title.innerText = productData.product.name;
    title.className = 'product-title';

    const secondaryTitle = document.createElement('h2');
    secondaryTitle.innerText = productData.product.scientificName;
    secondaryTitle.className = 'product-secondary-title';

    titles.appendChild(title);
    titles.appendChild(secondaryTitle);

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

    const productSelection = document.createElement('div');

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

    const btn = document.createElement('button');
    productTypes.appendChild(priceLabel);
    productTypes.appendChild(typeDropdown);
    productSelection.appendChild(productTypes);
    productSelection.appendChild(btn);

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

    // Add elements to container
    container.appendChild(imageGallery);
    container.appendChild(description);
    container.appendChild(titles);
    container.appendChild(productSelection);
    container.appendChild(specifications);
    container.appendChild(shippingInfo);

    return container;
}

