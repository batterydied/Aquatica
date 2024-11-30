import { BaseComponent } from '../../app/BaseComponent.js';
import { handleIncrease, updatePrice, handleDecrease, handleAddToCart } from './events.js';

export class ProductPage extends BaseComponent {
  #container = null;
  #productData = null; // Store fetched product data

  constructor() {
    super();
    this.loadCSS('ProductPage'); // Dynamically load CSS specific to ProductPage
  }

  // Fetch product data from the backend API
  async fetchProductData(productId) {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product data: ${response.statusText}`);
      }
      this.#productData = await response.json(); // Store fetched product data
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }

  // Render the ProductPage
  async render(productId = null) {
    if (productId) {
      await this.fetchProductData(productId); // Fetch product data for the given ID
    }

    if (this.#container) {
      this.#container.innerHTML = ''; // Clear existing content
      this.#setupContainerContent(); // Populate with updated data
      return this.#container;
    }

    // Create the main container for the ProductPage
    this.#container = document.createElement('div');
    this.#container.className = 'product-page';

    this.#setupContainerContent(); // Populate the container with content

    return this.#container;
  }

  // Populate the ProductPage's container
  #setupContainerContent() {
    if (!this.#productData) {
      this.#container.innerHTML = '<p>Failed to load product data.</p>';
      return;
    }

    const productInfoPanel = this.#createProductInfoPanel(); // Panel with product details
    const imageGallery = this.#createImageGallery(); // Image gallery
    const reviewsAndRatings = this.#createReviewsAndRatings(); // Reviews and ratings section

    const top = document.createElement('div');
    const bottom = document.createElement('div');

    top.className = 'topContainer';
    bottom.className = 'bottomContainer';

    top.appendChild(imageGallery);
    top.appendChild(productInfoPanel);
    bottom.appendChild(reviewsAndRatings);

    this.#container.appendChild(top);
    this.#container.appendChild(bottom);
  }

  // Create the product info panel
  #createProductInfoPanel() {
    const titles = this.#createTitles(); // Titles section
    const description = this.#createDescription(); // Description section
    const specifications = this.#createSpecifications(); // Specifications section
    const productSelection = this.#createProductSelection(); // Type and quantity selection
    const shippingInfo = this.#createShippingInfo(); // Shipping details

    const productInfoPanel = document.createElement('div');
    productInfoPanel.classList.add('product-info-panel');

    productInfoPanel.appendChild(titles);
    productInfoPanel.appendChild(productSelection);
    productInfoPanel.appendChild(shippingInfo);
    productInfoPanel.appendChild(description);
    productInfoPanel.appendChild(specifications);

    return productInfoPanel;
  }

  // Create product titles
  #createTitles() {
    const titles = document.createElement('div');
    titles.className = 'titles';

    const title = document.createElement('h1');
    title.className = 'product-title';
    title.innerText = this.#productData.name;

    const secondaryTitle = document.createElement('h2');
    secondaryTitle.className = 'product-secondary-title';
    secondaryTitle.innerText = this.#productData.sellername;

    titles.appendChild(secondaryTitle);
    titles.appendChild(title);

    return titles;
  }

  // Create the image gallery
  #createImageGallery() {
    const imageGallery = document.createElement('div');
    imageGallery.className = 'image-gallery';

    const mainImage = document.createElement('img');
    mainImage.className = 'main-img';
    mainImage.src = this.#productData.Images?.[0]?.url || '';
    mainImage.alt = `${this.#productData.name} main image`;

    const thumbnails = document.createElement('div');
    thumbnails.className = 'image-panel';

    this.#productData.Images?.forEach((image) => {
      const thumbnail = document.createElement('img');
      thumbnail.className = 'thumbnail-img';
      thumbnail.src = image.url;
      thumbnail.alt = `${this.#productData.name} thumbnail`;
      thumbnail.addEventListener('mouseover', () => {
        mainImage.src = thumbnail.src; // Change main image on hover
      });
      thumbnails.appendChild(thumbnail);
    });

    imageGallery.appendChild(thumbnails);
    imageGallery.appendChild(mainImage);

    return imageGallery;
  }

  // Create product description
  #createDescription() {
    const description = document.createElement('p');
    description.className = 'product-description';
    description.innerText = this.#productData.description;

    return description;
  }

  // Create product specifications
  #createSpecifications() {
    const specifications = document.createElement('ul');
    specifications.className = 'product-specifications';

    const specs = this.#productData.specifications || {};
    Object.entries(specs).forEach(([key, value]) => {
      const specItem = document.createElement('li');
      specItem.innerText = `${key}: ${value}`;
      specifications.appendChild(specItem);
    });

    return specifications;
  }

  // Create product selection options (types, quantity, and "Add to Cart")
  #createProductSelection() {
    const productSelection = document.createElement('div');
    productSelection.className = 'product-selection';

    const priceLabel = document.createElement('p');
    priceLabel.innerText = 'Price: ';
    priceLabel.id = 'product-price';

    const price = document.createElement('span');
    price.id = 'price';
    price.dataset.originalPrice = this.#productData.price?.toFixed(2) || '0.00';
    price.innerText = price.dataset.originalPrice;
    priceLabel.appendChild(price);

    // Create a container for the dropdown (optional)
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown-container';

    // Check if ProductTypes exists and is not empty before creating dropdown
    if (this.#productData.ProductTypes && this.#productData.ProductTypes.length > 0) {
        const typeDropdown = document.createElement('select');
        typeDropdown.className = 'type-dropdown';

        this.#productData.ProductTypes.forEach((type) => {
            const option = document.createElement('option');
            option.value = type.type;
            option.innerText = `${type.type} - $${type.price.toFixed(2)}`;
            typeDropdown.appendChild(option);
        });

        typeDropdown.addEventListener('change', (e) => {
            const selectedType = this.#productData.ProductTypes.find((type) => type.type === e.target.value);
            const amount = parseInt(document.getElementById('quantity-input').value, 10) || 1;
            price.dataset.originalPrice = selectedType.price;
            price.innerText = (selectedType.price * amount).toFixed(2);
        });

        dropdownContainer.appendChild(typeDropdown); // Add dropdown to container
        productSelection.appendChild(dropdownContainer); // Append container to selection
    }

    const quantityForm = document.createElement('div');
    quantityForm.className = 'quantity-form';

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = '1';
    quantityInput.min = '1';
    quantityInput.classList.add('quantity-input');
    quantityInput.id = 'quantity-input';
    quantityInput.addEventListener('input', updatePrice);

    const quantityIncrease = document.createElement('button');
    quantityIncrease.innerText = '+';
    quantityIncrease.classList.add('quantity-increase');
    quantityIncrease.addEventListener('click', () => {
        handleIncrease();
        updatePrice();
    });

    const quantityDecrease = document.createElement('button');
    quantityDecrease.innerText = '-';
    quantityDecrease.classList.add('quantity-decrease');
    quantityDecrease.addEventListener('click', () => {
        handleDecrease();
        updatePrice();
    });

    quantityForm.appendChild(quantityDecrease);
    quantityForm.appendChild(quantityInput);
    quantityForm.appendChild(quantityIncrease);

    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'add-to-cart';
    addToCartBtn.innerText = 'Add to Cart';
    addToCartBtn.addEventListener('click', handleAddToCart);

    productSelection.appendChild(priceLabel);
    productSelection.appendChild(quantityForm);
    productSelection.appendChild(addToCartBtn);

    return productSelection;
}


  // Create reviews and ratings
  #createReviewsAndRatings() {
    const container = document.createElement('div');
    container.className = 'reviewsAndRatingsContainer';

    const reviewsTitle = document.createElement('h3');
    reviewsTitle.innerText = `Reviews (${this.#productData.Reviews?.length || 0})`;
    container.appendChild(reviewsTitle);

    this.#productData.Reviews?.forEach((review) => {
      const reviewContainer = document.createElement('div');
      reviewContainer.className = 'review';

      const user = document.createElement('strong');
      user.innerText = review.user;

      const rating = document.createElement('span');
      rating.innerText = ` - Rating: ${review.rating}`;

      const comment = document.createElement('p');
      comment.innerText = review.comment;

      reviewContainer.appendChild(user);
      reviewContainer.appendChild(rating);
      reviewContainer.appendChild(comment);

      container.appendChild(reviewContainer);
    });

    return container;
  }

  // Create shipping info
  #createShippingInfo() {
    const shippingInfo = document.createElement('p');
    shippingInfo.className = 'shipping-info';
    shippingInfo.innerText = `Shipping: ${this.#productData.shippingInfo?.shippingCost || 'N/A'}, Delivery: ${this.#productData.shippingInfo?.deliveryTime || 'N/A'}`;
    return shippingInfo;
  }
}
