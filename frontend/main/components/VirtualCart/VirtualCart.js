import { BaseComponent } from '../../app/BaseComponent.js';

export class VirtualCart extends BaseComponent {
  #container = null;
  #cartData = [
    {
      id: 1,
      name: 'Fish Tank',
      description: 'A durable glass fish tank for your aquatic pets.',
      price: 50.0,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Fish Food',
      description: 'High-quality fish food for healthy growth.',
      price: 20.0,
      quantity: 2,
    },
    {
      id: 3,
      name: 'Aquatic Plant',
      description: 'A decorative aquatic plant for your tank.',
      price: 15.0,
      quantity: 1,
    },
  ];

  #appController; // Reference to the AppController for navigation

  constructor(appController) {
    super();
    this.loadCSS('VirtualCart'); // Load the associated CSS for the cart
    this.#appController = appController; // Pass in the AppController instance
  }

  render() {
    if (this.#container) {
      return this.#container;
    }

    this.#container = document.createElement('div');
    this.#container.classList.add('cart-container');
    this.#setupContainerContent();
    this.#attachEventListeners();

    return this.#container;
  }

  #setupContainerContent() {
    this.#container.innerHTML = `
      <div class="cart-left">
        <a href="#" class="back-link">← Back</a>
        <h2>Your Cart</h2>
        <div id="cart-items">
          ${
            this.#cartData.length > 0
              ? this.#generateCartItems()
              : '<p class="empty-cart">Your cart is empty.</p>'
          }
        </div>
      </div>
      <div class="cart-right">
        <h3>Cart Totals</h3>
        <div class="cart-totals">
          <p class="totals-row"><span class="text">Shipping:</span> <span id="shipping" class="price">$5.99</span></p>
          <p class="totals-row"><span class="text">Tax:</span> <span id="tax" class="price">$0.00</span></p>
          <p class="totals-row subtotal"><span class="text">Subtotal:</span> <span id="subtotal" class="price">$0.00</span></p>
          <hr class="total-divider" />
          <p class="totals-row total"><span class="text">Total:</span> <span id="total" class="price">$0.00</span></p>
        </div>
        <button class="checkout-button">Proceed to Checkout</button>
      </div>
    `;
    this.#updateCartTotals();
  }

  #generateCartItems() {
    return this.#cartData
      .map(
        (item, index) => `
        <div class="cart-item">
          <div class="item-details">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
          </div>
          <div class="item-quantity">
            <button class="decrement" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="increment" data-index="${index}">+</button>
          </div>
          <div class="item-price">
            $${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      `
      )
      .join('');
  }

  #updateCartTotals() {
    const subtotal = this.#cartData.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = this.#cartData.length > 0 ? 5.99 : 0; // Flat shipping rate
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    this.#container.querySelector('#subtotal').textContent =
      subtotal.toFixed(2);
    this.#container.querySelector('#shipping').textContent =
      shipping.toFixed(2);
    this.#container.querySelector('#tax').textContent = tax.toFixed(2);
    this.#container.querySelector('#total').textContent = total.toFixed(2);
  }

  #attachEventListeners() {
    const cartItemsContainer = this.#container.querySelector('#cart-items');

    cartItemsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('increment')) {
        const index = e.target.dataset.index;
        this.#cartData[index].quantity++;
        this.#refreshCart();
      }

      if (e.target.classList.contains('decrement')) {
        const index = e.target.dataset.index;
        if (this.#cartData[index].quantity > 1) {
          this.#cartData[index].quantity--;
        } else {
          this.#cartData.splice(index, 1);
        }
        this.#refreshCart();
      }
    });

    const checkoutButton = this.#container.querySelector('.checkout-button');
    checkoutButton.addEventListener('click', () => {
      this.#appController.navigate('checkout'); // Navigate to the checkout view
    });
  }

  #refreshCart() {
    const cartItemsContainer = this.#container.querySelector('#cart-items');
    cartItemsContainer.innerHTML = this.#generateCartItems();
    this.#updateCartTotals();
  }

  addItemToCart(item) {
    const existingItemIndex = this.#cartData.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    if (existingItemIndex >= 0) {
      this.#cartData[existingItemIndex].quantity += item.quantity;
    } else {
      this.#cartData.push(item);
    }
    this.#refreshCart();
  }
}

