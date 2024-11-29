import { BaseComponent } from '../../app/BaseComponent.js';
import { productData } from './product_page_mock_data.js';
import { handleIncrease, updatePrice, handleDecrease, handleAddToCart } from './events.js';

export class ProductPage extends BaseComponent {
  #container = null;

  constructor() {
    super();
    // Dynamically load the CSS specific to the ProductPage component
    this.loadCSS('ProductPage');
  }

  // Renders the ProductPage and returns the container element
  render() {
    if (this.#container) {
      return this.#container; // Return existing container if already created
    }

    // Create a new container for the ProductPage
    this.#container = document.createElement('div');
    this.#container.className = 'product-page';

    // Populate the container with all necessary content
    this.#setupContainerContent();

    return this.#container;
  }

  // Set up the main content of the ProductPage
  #setupContainerContent() {
    const productInfoPanel = this.#createProductInfoPanel(); // Panel with product details
    const imageGallery = this.#createImageGallery(); // Product images gallery
    const reviewsAndRatings = this.#createReviewsAndRatings(); // Reviews and ratings section

    // Separate containers for layout organization
    const top = document.createElement('div');
    const bottom = document.createElement('div');
    top.appendChild(imageGallery); // Add gallery to the top section
    top.appendChild(productInfoPanel); // Add product info panel to the top section
    bottom.appendChild(reviewsAndRatings); // Add reviews and ratings to the bottom section

    // Assign class names for styling
    top.className = 'topContainer';
    bottom.className = 'bottomContainer';

    // Append sections to the main container
    this.#container.appendChild(top);
    this.#container.appendChild(bottom);
  }

  // Create the product info panel with titles, description, etc.
  #createProductInfoPanel() {
    const titles = this.#createTitles(); // Product titles
    const description = this.#createDescription(); // Product description
    const specifications = this.#createSpecifications(); // Product specifications
    const productSelection = this.#createProductSelection(); // Selection options like type and quantity
    const shippingInfo = this.#createShippingInfo(); // Shipping details

    const productInfoPanel = document.createElement('div');
    productInfoPanel.classList.add('product-info-panel');

    // Append individual elements to the product info panel
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

    const title = document.createElement('h1'); // Main product name
    title.innerText = productData.product.name;
    title.className = 'product-title';

    const secondaryTitle = document.createElement('h2'); // Scientific or secondary name
    secondaryTitle.innerText = productData.product.scientificName;
    secondaryTitle.className = 'product-secondary-title';

    // Add titles to the container
    titles.appendChild(secondaryTitle);
    titles.appendChild(title);
    titles.className = 'titles';

    return titles;
  }

  // Create image gallery for product images
  #createImageGallery() {
    const imageGallery = document.createElement('div');
    imageGallery.className = 'image-gallery';

    const mainImage = document.createElement('img'); // Main large image
    mainImage.src = productData.product.images[0]; // Default to the first image
    mainImage.alt = `${productData.product.name} main image`;
    mainImage.className = 'main-img';

    const imagePanel = document.createElement('div'); // Thumbnails container
    imagePanel.classList.add('image-panel');
    productData.product.images.forEach((imageUrl) => {
      const img = document.createElement('img'); // Thumbnail images
      img.src = imageUrl;
      img.alt = `${productData.product.name} thumbnail image`;
      img.className = 'thumbnail-img';
      img.addEventListener('mouseover', () => {
        mainImage.src = img.src; // Update main image on hover
        img.classList.add('image-border'); // Add border effect to the thumbnail
      });
      imagePanel.appendChild(img);
    });

    // Add thumbnails and main image to the gallery
    imageGallery.appendChild(imagePanel);
    imageGallery.appendChild(mainImage);

    return imageGallery;
  }

  // Create product description element
  #createDescription() {
    const description = document.createElement('p');
    description.innerText = productData.product.description; // Description text
    description.className = 'product-description';

    return description;
  }

  // Create product selection options (type, quantity, add to cart)
  #createProductSelection() {
    const productSelection = document.createElement('div');
    const productTypes = document.createElement('div');
    productTypes.className = 'product-types';

    // Display the product price
    const priceLabel = document.createElement('p');
    priceLabel.innerText = 'Price: ';
    const price = document.createElement('span');
    price.dataset.originalPrice = productData.product.selectedProductType.price.toFixed(2);
    price.innerText = price.dataset.originalPrice;
    priceLabel.appendChild(price);
    price.id = 'price';
    priceLabel.id = 'product-price';

    // Dropdown for product types
    const typeDropdown = document.createElement('select');
    typeDropdown.className = 'type-dropdown';
    productData.product.productTypes.forEach((type) => {
      const option = document.createElement('option');
      option.value = type.type; // Type value
      option.innerText = `${type.type} - $${type.price.toFixed(2)}`; // Type display text
      typeDropdown.appendChild(option);
    });

    // Set the default type and update price on change
    typeDropdown.value = productData.product.selectedProductType.type;
    typeDropdown.addEventListener('change', (e) => {
      const selectedType = productData.product.productTypes.find(
        (type) => type.type === e.target.value,
      );
      const amount = parseInt(document.getElementById('quantity-input').value) || 1;
      price.dataset.originalPrice = selectedType.price;
      price.innerText = (selectedType.price * amount).toFixed(2); // Update price
    });

    // Add to cart button
    const addToCartBtn = document.createElement('button');
    addToCartBtn.classList.add('add-to-cart');
    addToCartBtn.innerText = 'Add to Cart';
    addToCartBtn.addEventListener('click', handleAddToCart); // Event handler for adding to cart

    // Quantity input and buttons
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = '1';
    quantityInput.min = '1';
    quantityInput.classList.add('quantity-input');
    quantityInput.id = 'quantity-input';
    quantityInput.addEventListener('input', updatePrice);

    // Buttons to increase and decrease quantity
    const quantityForm = document.createElement('div');
    const quantityIncrease = document.createElement('input');
    quantityIncrease.value = '+';
    quantityIncrease.type = 'button';
    quantityIncrease.classList.add('quantity-increase');
    quantityIncrease.addEventListener('click', () => {
      handleIncrease();
      updatePrice();
    });

    const quantityDecrease = document.createElement('input');
    quantityDecrease.value = '-';
    quantityDecrease.type = 'button';
    quantityDecrease.classList.add('quantity-decrease');
    quantityDecrease.addEventListener('click', () => {
      handleDecrease();
      updatePrice();
    });

    // Combine quantity controls
    quantityForm.appendChild(quantityDecrease);
    quantityForm.appendChild(quantityInput);
    quantityForm.appendChild(quantityIncrease);
    quantityForm.classList.add('quantity-form');
    const quantityLabel = document.createElement('h1');
    quantityLabel.innerText = 'Quantity';
    quantityLabel.className = 'product-secondary-title';

    priceLabel.className = 'product-secondary-title';

    // Combine product selection elements
    productTypes.appendChild(priceLabel);
    productTypes.appendChild(typeDropdown);
    productSelection.appendChild(productTypes);
    productSelection.appendChild(quantityLabel);
    productSelection.appendChild(quantityForm);
    productSelection.appendChild(addToCartBtn);
    productSelection.classList.add('product-selection');

    return productSelection;
  }

  // Create product specifications list
  #createSpecifications() {
    const specifications = document.createElement('ul');
    specifications.className = 'product-specifications';

    // Add each specification as a list item
    Object.entries(productData.product.specifications).forEach(([key, value]) => {
      const specItem = document.createElement('li');
      specItem.innerText = `${key}: ${value}`;
      specifications.appendChild(specItem);
    });

    return specifications;
  }

  // Create shipping info element
  #createShippingInfo() {
    const shippingInfo = document.createElement('p');
    shippingInfo.innerText = `Shipping: ${productData.product.shippingInfo.shippingCost}, Delivery: ${productData.product.shippingInfo.deliveryTime}`;
    shippingInfo.className = 'shipping-info';

    return shippingInfo;
  }

  // Create reviews and ratings section
  #createReviewsAndRatings() {
    const reviewsAndRatingsContainer = document.createElement('div');
    reviewsAndRatingsContainer.className = 'reviewsAndRatingsContainer';

    const reviewsAndRatings = document.createElement('div');
    reviewsAndRatings.className = 'reviewsAndRatings';

    const reviewsAndRatingsBar = document.createElement('div');
    reviewsAndRatingsBar.className = 'reviewsAndRatingsBar';

    // Add title and star rating display
    const reviewsTitle = document.createElement('div');
    reviewsTitle.innerText = `Reviews (${productData.product.reviewsCount}) ${productData.product.rating}`;
    reviewsTitle.className = 'reviewsTitle';

    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';

    // Add star icons based on the rating
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('i');
      star.className = i <= Math.floor(productData.product.rating) ? 'fas fa-star' : 'far fa-star';
      starsContainer.appendChild(star);
    }
    reviewsTitle.appendChild(starsContainer);
    reviewsAndRatingsBar.appendChild(reviewsTitle);

    const customerReviews = document.createElement('div');
    productData.product.reviews.forEach(review => {
      const rev = document.createElement('div');
      rev.className = 'review';

      // Add user, stars, and date
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

      // Add review comment
      const comment = document.createElement('div');
      comment.className = 'comment';
      comment.innerText = `${review.comment}`;
      rev.appendChild(userStarsDate);
      rev.appendChild(comment);

      customerReviews.appendChild(rev);
    });
    customerReviews.className = 'reviews';

    reviewsAndRatings.appendChild(reviewsAndRatingsBar);
    reviewsAndRatings.appendChild(customerReviews);

    // Add new review functionality
    const addReview = document.createElement('div');
    addReview.className = 'addReview';

    const addRatingContainer = document.createElement('div');
    addRatingContainer.className = 'addRatingContainer';

    // Add star input for new ratings
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('i');
      star.className = 'far fa-star';
      star.dataset.value = i;
      addRatingContainer.appendChild(star);
    }

    const ratingValueDisplay = document.createElement('p');
    ratingValueDisplay.className = 'ratingValue';
    ratingValueDisplay.innerText = 'Rating: 0';

    addReview.appendChild(addRatingContainer);
    addReview.appendChild(ratingValueDisplay);

    const stars = addRatingContainer.querySelectorAll('i');
    let currentRating = 0;

    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        currentRating = index + 1; // Update rating based on click
        updateRatingDisplay();
      });

      star.addEventListener('mouseover', () => highlightStars(index)); // Highlight stars on hover
      star.addEventListener('mouseout', updateRatingDisplay); // Reset stars on mouse out
    });

    // Highlight stars up to the current index
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

    // Update stars to match the current rating
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

    // Input box for adding review comments
    const addReviewBox = document.createElement('input');
    addReviewBox.className = 'addReviewBox';
    addReviewBox.type = 'text';
    addReviewBox.placeholder = 'Add review';
    addReview.appendChild(addReviewBox);

    // Add review button
    const addReviewButton = document.createElement('button');
    addReviewButton.textContent = ' + Add Review';
    addReviewButton.className = 'addReviewButton';
    addReview.appendChild(addReviewButton);

    // Combine all reviews and the "Add Review" section
    reviewsAndRatingsContainer.appendChild(reviewsAndRatings);
    reviewsAndRatingsContainer.appendChild(addReview);

    return reviewsAndRatingsContainer;
  }
}
