import { BaseComponent } from '../../app/BaseComponent.js';
import { productData } from '../../../tests/mock_data/product_page_mock_data.js';

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
    const productInfoPanel = this.#createProductInfoPanel();
    // Titles
    const titles = this.#createTitles();

    // Image Gallery
    const imageGallery = this.#createImageGallery();

    // Append all elements to the container
    this.#container.appendChild(imageGallery);
    this.#container.appendChild(productInfoPanel);
  }
  #createProductInfoPanel(){
    const titles = this.#createTitles();
    const description = this.#createDescription();
    const specifications = this.#createSpecifications();
    const productSelection = this.#createProductSelection();
    const shippingInfo = this.#createShippingInfo();
    const productInfoPanel = document.createElement('div');
    productInfoPanel.classList.add('product-info-panel');
    productInfoPanel.appendChild(titles);
    productInfoPanel.appendChild(productSelection);
    productInfoPanel.appendChild(shippingInfo);
    productInfoPanel.appendChild(description);
    productInfoPanel.appendChild(specifications);
    return productInfoPanel;

  }
  #createTitles() {
    const titles = document.createElement('div');

    const title = document.createElement('h1');
    title.innerText = productData.product.name;
    title.className = 'product-title';

    const secondaryTitle = document.createElement('h2');
    secondaryTitle.innerText = productData.product.scientificName;
    secondaryTitle.className = 'product-secondary-title';

    titles.appendChild(secondaryTitle);
    titles.appendChild(title);
    titles.className = 'titles';

    return titles;
  }

  #createImageGallery() {
    const imageGallery = document.createElement('div');
    imageGallery.className = 'image-gallery';

    const mainImage = document.createElement('img');
    mainImage.src = productData.product.images[0]; // Default to the first image
    mainImage.alt = `${productData.product.name} main image`;
    mainImage.className = 'main-img';

    const imagePanel = document.createElement('div');
    imagePanel.classList.add('image-panel');
    productData.product.images.forEach((imageUrl) => {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = `${productData.product.name} thumbnail image`;
      img.className = 'thumbnail-img';
      img.addEventListener('mouseover', ()=>{
        mainImage.src = img.src;
      });
      imagePanel.appendChild(img);
    });
    imageGallery.appendChild(imagePanel);
    imageGallery.appendChild(mainImage);

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
    addToCartBtn.classList.add('add-to-cart');


    const quantityForm = document.createElement('div');
    const quantityIncrease = document.createElement('input');
    quantityIncrease.value = '+';
    quantityIncrease.type = 'button';
    quantityIncrease.classList.add('quantity-increase');
    quantityIncrease.classList.add('quantity-increase');

    const quantityDecrease = document.createElement('input');
    quantityIncrease.classList.add('quantity-decrease');
    quantityDecrease.value = '-';
    quantityDecrease.type = 'button';
    quantityDecrease.classList.add('quantity-decrease');

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = '1';
    quantityInput.min = '1';
    quantityInput.classList.add('quantity-input');

    quantityForm.appendChild(quantityDecrease);
    quantityForm.appendChild(quantityInput);
    quantityForm.appendChild(quantityIncrease);
    quantityForm.classList.add('quantity-form');
    const quantityLabel= document.createElement('h1');
    quantityLabel.innerText = "Quantity";
    quantityLabel.className = 'product-secondary-title';


    priceLabel.className = 'product-secondary-title';

    productTypes.appendChild(priceLabel);
    productTypes.appendChild(typeDropdown);
    productSelection.appendChild(productTypes);
    productSelection.appendChild(quantityLabel);
    productSelection.appendChild(quantityForm);
    productSelection.appendChild(addToCartBtn);
    productSelection.classList.add('product-selection');

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
