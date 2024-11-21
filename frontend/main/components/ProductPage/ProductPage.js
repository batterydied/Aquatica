import { BaseComponent } from '../../app/BaseComponent.js';
import { productData } from './product_page_mock_data.js';
import { handleIncrease, updatePrice, handleDecrease, handleAddToCart } from './events.js';
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

    const reviewsAndRatings = this.#createReviewsAndRatings();
    // Append all elements to the container

    const top = document.createElement('div');
    const bottom = document.createElement('div');
    top.appendChild(imageGallery);
    top.appendChild(productInfoPanel);
    bottom.appendChild(reviewsAndRatings);
    
    top.className = 'topContainer';
    bottom.className ='bottomContainer';
    this.#container.appendChild(top);
    this.#container.appendChild(bottom);
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
        img.classList.add('image-border');
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
    priceLabel.innerText = 'Price: ';
    const price = document.createElement('span');
    price.dataset.originalPrice = productData.product.selectedProductType.price.toFixed(2);
    price.innerText = price.dataset.originalPrice;
    priceLabel.appendChild(price);
    price.id = 'price';
 
    priceLabel.id = 'product-price';

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
      const amount = parseInt(document.getElementById('quantity-input').value) || 1;
      price.dataset.originalPrice = selectedType.price;
      price.innerText = (selectedType.price * amount).toFixed(2)
    });

    const addToCartBtn = document.createElement('button');
    addToCartBtn.classList.add('add-to-cart');
    addToCartBtn.innerText = 'Add to Cart';
    addToCartBtn.addEventListener('click', handleAddToCart);

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = '1';
    quantityInput.min = '1';
    quantityInput.classList.add('quantity-input');
    quantityInput.id = 'quantity-input';
    quantityInput.addEventListener('input', ()=>{
      updatePrice();
    });

    const quantityForm = document.createElement('div');
    const quantityIncrease = document.createElement('input');
    quantityIncrease.value = '+';
    quantityIncrease.type = 'button';
    quantityIncrease.classList.add('quantity-increase');
    quantityIncrease.addEventListener('click', ()=>{
      handleIncrease();
      updatePrice();
    });

    const quantityDecrease = document.createElement('input');
    quantityDecrease.value = '-';
    quantityDecrease.type = 'button';
    quantityDecrease.classList.add('quantity-decrease');
    quantityDecrease.addEventListener('click', ()=>{
      handleDecrease();
      updatePrice();
    });

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
  #createReviewsAndRatings(){
    const reviewsAndRatingsContainer = document.createElement('div');
    reviewsAndRatingsContainer.className = 'reviewsAndRatingsContainer';

    const reviewsAndRatings = document.createElement('div');
    reviewsAndRatings.className = 'reviewsAndRatings';

    const reviewsAndRatingsBar = document.createElement('div');
    reviewsAndRatingsBar.className = 'reviewsAndRatingsBar';

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
    reviewsAndRatingsBar.appendChild(reviewsTitle);

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

    reviewsAndRatings.appendChild(reviewsAndRatingsBar);
    reviewsAndRatings.appendChild(customerReviews);

    const addReview = document.createElement('div');
    addReview.className = 'addReview';

    const addRatingContainer = document.createElement('div')
    addRatingContainer.className = 'addRatingContainer';

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
            currentRating = index + 1; 
            updateRatingDisplay();
        });

        star.addEventListener('mouseover', () => highlightStars(index));
        star.addEventListener('mouseout', updateRatingDisplay); 
    });
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


  const addReviewBox = document.createElement('input');
  addReviewBox.className = 'addReviewBox';
  addReviewBox.type = 'text';
  addReviewBox.placeholder = 'Add review'
  addReview.appendChild(addReviewBox);

  const addReviewButton = document.createElement('button');
  addReviewButton.textContent = ' + Add Review';
  addReviewButton.className = 'addReviewButton';


  addReview.appendChild(addReviewButton);

  reviewsAndRatingsContainer.appendChild(reviewsAndRatings);
  reviewsAndRatingsContainer.appendChild(addReview);
    return reviewsAndRatingsContainer;
  }
}
