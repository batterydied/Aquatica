import { BaseComponent } from '../../app/BaseComponent.js';
import { AppController } from '../../app/AppController.js';
import { handleIncrease, updatePrice, handleDecrease, handleAddToCart, addReview} from './events.js';

export class ProductPage extends BaseComponent {
  #container = null;
  #productData = null; // Store fetched product data

  constructor() {
    super();
    this.loadCSS('ProductPage'); // Dynamically load CSS specific to ProductPage
  }

  // Fetch product data from the backend API
  async fetchProductData(productId) {
    console.log("ProductID is: " + productId);
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
  async render(productId = 'abab6f2f-bc59-42b8-b433-13766b18953b') { //defaults to this Id
    if (productId) {
      await this.fetchProductData(productId); // Fetch product data for the given ID
    }
    else{
      const text = document.createElement('h1');
      text.innerText = 'Invalid product ID';
      return text;
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
    const productInfoPanel = document.createElement('div');
    productInfoPanel.classList.add('product-info-panel');

    productInfoPanel.appendChild(titles);
    productInfoPanel.appendChild(productSelection);
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
    if(this.#productData.secondaryname){
      const secondaryTitle = document.createElement('h2');
      secondaryTitle.className = 'product-secondary-title';
      secondaryTitle.innerText = this.#productData.secondaryname;
      titles.appendChild(secondaryTitle);
    }
    const sellerLink = document.createElement('a');
    const appController = AppController.getInstance();
    //placeholder for now, supposed to go to the target seller's page
    sellerLink.addEventListener('click', (event) => {
      // Use appController to navigate
      appController.navigate('profilePage');
    })

    const sellerName = document.createElement('p');
    sellerName.className = 'sellername';
    sellerName.innerText = `Visit the ${this.#productData.sellername} store`;
    sellerLink.appendChild(sellerName);
    

    titles.appendChild(title);
    titles.appendChild(sellerLink);
    const horizontalLine = document.createElement('hr');
    titles.appendChild(horizontalLine);

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

    this.#productData.Images?.forEach((image, index) => {
      const thumbnail = document.createElement('img');
      thumbnail.className = 'thumbnail-img';
      thumbnail.src = image.url;
      thumbnail.alt = `${this.#productData.name} thumbnail`;
    
      // Add a border to the first thumbnail by default
      if (index === 0) {
        thumbnail.classList.add('image-border'); // Apply border to the first thumbnail
      }
    
      // Add event listener for hover
      thumbnail.addEventListener('mouseover', () => {
        mainImage.src = thumbnail.src; // Change main image on hover
        
        // Remove border from all thumbnails first
        document.querySelectorAll('.thumbnail-img').forEach((thumb) => {
          thumb.classList.remove('image-border');
        });
    
        // Add border effect to the hovered thumbnail
        thumbnail.classList.add('image-border');
      });
    
      // Append thumbnail to the container
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

    const alertMessage = document.createElement('p');
    alertMessage.classList.add('alert-msg');
    if(!this.#productData.quantity){
      alertMessage.innerText = 'Out of stock'
    } else if(this.#productData.quantity <= 15){
      alertMessage.classList.add('alert-msg');
      alertMessage.innerText = `Only ${this.#productData.quantity} left!`
    } else {
      alertMessage.style.color = 'green';
      alertMessage.innerText = 'In stock'
    }
    productSelection.appendChild(alertMessage);
  
    // Product Types Container
    const productTypes = document.createElement('div');
    productTypes.className = 'product-types';

    // Price Label and Span
    const priceLabel = document.createElement('p');
    priceLabel.innerText = 'Price: ';
    priceLabel.id = 'product-price';
    priceLabel.className = 'product-secondary-title';

    const price = document.createElement('span');
    price.id = 'price';
    price.dataset.originalPrice = this.#productData.price?.toFixed(2) || 0.00;
    price.innerText = price.dataset.originalPrice;
    priceLabel.appendChild(price);

    // Append price label to product types
    productTypes.appendChild(priceLabel);

    // Product Types Dropdown
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown-container';
    const typeDropdown = document.createElement('select');
    typeDropdown.className = 'type-dropdown';

    // Reverse the ProductTypes array
    const reversedProductTypes = [...this.#productData.ProductTypes].reverse();

    reversedProductTypes.forEach((type) => {
      const option = document.createElement('option');
      option.value = type.type;
      option.innerText = `${type.type} - $${type.price.toFixed(2)}`;
      typeDropdown.appendChild(option);
    });

    // Set default value
    typeDropdown.value = reversedProductTypes[0]?.type || '';

    // Update price on dropdown change
    let selectedType = reversedProductTypes[0];
    typeDropdown.addEventListener('change', (e) => {
      selectedType = reversedProductTypes.find((type) => type.type === e.target.value);
      const amount = parseInt(document.getElementById('quantity-input').value, 10) || 1;
      price.dataset.originalPrice = selectedType.price;
      price.innerText = (selectedType.price * amount).toFixed(2);
    });

    dropdownContainer.appendChild(typeDropdown);
    productTypes.appendChild(dropdownContainer);

    // Append product types to product selection
    productSelection.appendChild(productTypes);

    // Quantity Controls
    const quantityLabel = document.createElement('h1');
    quantityLabel.innerText = 'Quantity';
    quantityLabel.className = 'product-secondary-title';

    const quantityForm = document.createElement('div');
    quantityForm.className = 'quantity-form';

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = 1;
    quantityInput.min = 1;
    quantityInput.classList.add('quantity-input');
    quantityInput.id = 'quantity-input';
    quantityInput.addEventListener('input', ()=>updatePrice(this.#productData.quantity));

    // Quantity Increase Button
    const quantityIncrease = document.createElement('input');
    quantityIncrease.type = 'button';
    quantityIncrease.value = '+';
    quantityIncrease.className = 'quantity-increase';
    quantityIncrease.addEventListener('click', () => {
      handleIncrease(quantityInput.max = this.#productData.quantity);
      updatePrice();
    });

    // Quantity Decrease Button
    const quantityDecrease = document.createElement('input');
    quantityDecrease.type = 'button';
    quantityDecrease.value = '-';
    quantityDecrease.className = 'quantity-decrease';
    quantityDecrease.addEventListener('click', () => {
      handleDecrease();
      updatePrice();
    });

    // Combine Quantity Controls
    quantityForm.appendChild(quantityDecrease);
    quantityForm.appendChild(quantityInput);
    quantityForm.appendChild(quantityIncrease);

    // Append quantity label and form to product selection
    productSelection.appendChild(quantityLabel);
    productSelection.appendChild(quantityForm);

    // Add to Cart / Buy Now Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'btn-container';

    if(!this.#productData.quantity || this.#productData.quantity < 1){
      const unavailableMessage = document.createElement('p');
      unavailableMessage.classList.add('unavailable-msg');
      unavailableMessage.innerText = 'This product is currently unavailable.';
      buttonContainer.appendChild(unavailableMessage);
    } else {
     // Buy Now button changed to navigate directly to checkout
      const buyNowBtn = document.createElement('button');
      buyNowBtn.className = 'buy-now';
      buyNowBtn.innerText = 'Buy Now';
      buyNowBtn.addEventListener('click', () => {
        const chosenQuantity = parseInt(quantityInput.value, 10);

        // Validate quantity
        if (!this.#productData || !this.#productData.quantity || chosenQuantity > this.#productData.  quantity) {
          alert("The requested quantity is not available. Please reduce the quantity.");
          return;
        }

        const appController = AppController.getInstance();
        const item = {
          name: this.#productData.name,
          productId: this.#productData.prodid,
          price: selectedType.price,
          description: this.#productData.description,
          quantity: chosenQuantity,
          type: selectedType.type
        };

        // Navigate directly to the checkout with this single item
        appController.navigate('secureCheckout', { items: [item] });
      });

      const addToCartBtn = document.createElement('button');
      addToCartBtn.className = 'add-to-cart';
      addToCartBtn.innerText = 'Add to Cart';
      addToCartBtn.addEventListener('click', () => {
        handleAddToCart(this.#productData, quantityInput.value, selectedType);
      });

      buttonContainer.appendChild(addToCartBtn);
      buttonContainer.appendChild(buyNowBtn);
    }

    // Append Add to Cart Button Container to product selection
    productSelection.appendChild(buttonContainer);

    return productSelection;
  }
  
  // Create reviews and ratings
  #createReviewsAndRatings() {
    const container = document.createElement('div');
    container.className = 'reviewsAndRatingsContainer';

    const reviewsAndRatings = document.createElement('div');
    reviewsAndRatings.className = 'reviewsAndRatings';
    container.appendChild(reviewsAndRatings);

    const reviewsAndRatingsBar = document.createElement('div')
    reviewsAndRatingsBar.className = 'reviewsAndRatingsBar';
    reviewsAndRatings.appendChild(reviewsAndRatingsBar);
    const reviewsTitle = document.createElement('h3');
    reviewsTitle.className = 'reviewsTitle';

    let averageRating = this.#productData.average_rating || 0;
    this.#productData.Reviews?.forEach(review => {
      averageRating += review.rating;
    });
    averageRating = averageRating/this.#productData.Reviews?.length;

    reviewsTitle.innerText = `Reviews (${this.#productData.Reviews?.length || 0}) ${averageRating}`;
    reviewsAndRatingsBar.appendChild(reviewsTitle);

    // Create stars display for the overall rating
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('i');
      star.className = i <= Math.floor(averageRating) ? 'fas fa-star' : 'far fa-star';
      starsContainer.appendChild(star);
    }
    reviewsAndRatingsBar.appendChild(starsContainer);

    // Display all reviews
    this.#productData.Reviews?.forEach((review) => {
      const reviewContainer = document.createElement('div');
      reviewContainer.className = 'review';

      const reviewBar = document.createElement('div');
      reviewBar.className = 'reviewBar';

      const userAndRating = document.createElement('div');

      const user = document.createElement('strong');
      user.innerText = review.user;

      const rating = document.createElement('span');
      rating.innerText = ` - Rating: ${review.rating}`;
      
      const date = document.createElement('span');
      const dateObj = new Date(review.updatedAt);
      date.innerText = `${dateObj.getMonth() + 1}-${dateObj.getDate()}-${dateObj.getFullYear()}`;

      const comment = document.createElement('p');
      comment.innerText = review.comment;

      userAndRating.appendChild(user);
      userAndRating.appendChild(rating);
      reviewBar.appendChild(userAndRating);
      reviewBar.appendChild(date);
      reviewContainer.appendChild(reviewBar);
      reviewContainer.appendChild(comment);

      reviewsAndRatings.appendChild(reviewContainer);
    });

    // Add the review input section at the bottom
    const addReviewSection = document.createElement('div');
    addReviewSection.className = 'addReview';

    const addRatingContainer = document.createElement('div');
    addRatingContainer.className = 'addRatingContainer';

    // Create star input for new ratings
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('i');
      star.className = 'far fa-star';
      star.dataset.value = i;
      addRatingContainer.appendChild(star);
    }

    const ratingValueDisplay = document.createElement('p');
    ratingValueDisplay.className = 'ratingValue';
    ratingValueDisplay.innerText = 'Rating: 0';
    addReviewSection.appendChild(addRatingContainer);
    addReviewSection.appendChild(ratingValueDisplay);

    let currentRating = 0;

    // Event listeners for star click/hover
    const stars = addRatingContainer.querySelectorAll('i');
    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        currentRating = index + 1;
        updateRatingDisplay();
      });

      star.addEventListener('mouseover', () => highlightStars(index));
      star.addEventListener('mouseout', updateRatingDisplay);
    });

    // Highlight stars on hover
    function highlightStars(index) {
      stars.forEach((star, i) => {
        if (i <= index) {
          star.classList.replace('far', 'fas');
          star.classList.add('selected');
        } else {
          star.classList.replace('fas', 'far');
          star.classList.remove('selected');
        }
      });
    }

    // Update the rating display based on selected stars
    function updateRatingDisplay() {
      stars.forEach((star, i) => {
        if (i < currentRating) {
          star.classList.replace('far', 'fas');
          star.classList.add('selected');
        } else {
          star.classList.replace('fas', 'far');
          star.classList.remove('selected');
        }
      });
      ratingValueDisplay.innerText = `Rating: ${currentRating}`;
    }

    // Input box for the review comment
    const addReviewBox = document.createElement('input');
    addReviewBox.className = 'addReviewBox';
    addReviewBox.type = 'text';
    addReviewBox.placeholder = 'Add review';
    addReviewSection.appendChild(addReviewBox);

    // Add review button
    const addReviewButtonDiv = document.createElement('div');
    addReviewButtonDiv.className = 'addReviewButtonDiv';
    const addReviewButton = document.createElement('button');
    addReviewButton.textContent = ' + Add Review';
    addReviewButton.className = 'addReviewButton';
    addReviewButton.addEventListener('click', async () => {
      const reviewData = {
        rating: currentRating,
        comment: addReviewBox.value,
        user: 'Current User', // Replace with actual user name
        prodData: this.#productData
      };

      if (reviewData.comment && currentRating > 0) {
        // Send the review data to the backend (you can integrate your API call here)
        await addReview(reviewData); // Function to handle the review submission
      }
    });
    addReviewButtonDiv.appendChild(addReviewButton);
    addReviewSection.appendChild(addReviewButtonDiv);

    container.appendChild(addReviewSection);

    return container;
  }
}
