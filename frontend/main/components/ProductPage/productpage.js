import { BaseComponent } from '../../app/BaseComponent.js';
import { productData } from '../../../tests/mock_data/product_page_mock_data.js';
import StyleSheet from '../../../functions/MakeStyleSheetLink.js';
import { imgUrl } from '../../../tests/mock_data/imgUrl.js';

export class ProductPage extends BaseComponent {
  #container = null;

  constructor() {
    super();
    this.loadCSS('ProductPage'); // Dynamically load the CSS for ProductPage
  }

  render() {
    if (this.#container) {
      return this.#container;
    }

    // Create the container element
    this.#container = document.createElement('div');
    this.#container.className = 'product-page';

    // Populate the container content
    this.#setupContainerContent();

    return this.#container;
  }

  #setupContainerContent() {
    // Titles
    const titles = this.#createTitles();

    // Image Gallery
    const imageGallery = this.#createImageGallery();

    // Description
    const description = this.#createDescription();

    // Product Selection (Price, Types, Add to Cart)
    const productSelection = this.#createProductSelection();

    // Specifications
    const specifications = this.#createSpecifications();

    // Shipping Info
    const shippingInfo = this.#createShippingInfo();

    // Append all elements to the container
    this.#container.appendChild(titles);
    this.#container.appendChild(imageGallery);
    this.#container.appendChild(description);
    this.#container.appendChild(productSelection);
    this.#container.appendChild(specifications);
    this.#container.appendChild(shippingInfo);
  }

  #createTitles() {
    const titles = document.createElement('div');

    const title = document.createElement('h1');
    title.innerText = productData.product.name;
    title.className = 'product-title';

    const secondaryTitle = document.createElement('h2');
    secondaryTitle.innerText = productData.product.scientificName;
    secondaryTitle.className = 'product-secondary-title';

    titles.appendChild(title);
    titles.appendChild(secondaryTitle);

    return titles;
  }

  #createImageGallery() {
    const imageGallery = document.createElement('div');
    imageGallery.className = 'image-gallery';

    productData.product.images.forEach((imageUrl) => {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = `${productData.product.name} thumbnail image`;
      img.className = 'thumbnail-img';
      imageGallery.appendChild(img);
    });

    return imageGallery;
  }

  #createDescription() {
    const description = document.createElement('p');
    description.innerText = productData.product.description;
    description.className = 'product-description';

    return description;
  }

  #createProductSelection() {
    const productSelection = document.createElement('div');

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
        (type) => type.type === e.target.value,
      );
      priceLabel.innerText = `Price: $${selectedType.price.toFixed(2)} (${selectedType.type})`;
    });

    const addToCartBtn = document.createElement('button');
    addToCartBtn.classList.add('add-to-cart');
    addToCartBtn.innerText = 'Add to Cart';

    productTypes.appendChild(priceLabel);
    productTypes.appendChild(typeDropdown);
    productSelection.appendChild(productTypes);
    productSelection.appendChild(addToCartBtn);

    return productSelection;
  }

  #createSpecifications() {
    const specifications = document.createElement('ul');
    specifications.className = 'product-specifications';

    Object.entries(productData.product.specifications).forEach(([key, value]) => {
      const specItem = document.createElement('li');
      specItem.innerText = `${key}: ${value}`;
      specifications.appendChild(specItem);
    });

    return specifications;
  }

  #createShippingInfo() {
    const shippingInfo = document.createElement('p');
    shippingInfo.innerText = `Shipping: ${productData.product.shippingInfo.shippingCost}, Delivery: ${productData.product.shippingInfo.deliveryTime}`;
    shippingInfo.className = 'shipping-info';

    return shippingInfo;
  }
}
