import { BaseComponent } from '../../app/BaseComponent.js';

export class SecureCheckout extends BaseComponent {
  #container = null;
  #prices = {
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  }; // Dynamic pricing

  constructor() {
    super();
    this.loadCSS('SecureCheckout'); // Load the associated CSS
  }

  render() {
    if (this.#container) {
      return this.#container;
    }

    this.#container = document.createElement('div');
    this.#container.classList.add('checkout-container');
    this.#setupContainerContent();
    this.#attachEventListeners();

    return this.#container;
  }

  #setupContainerContent() {
    this.#container.innerHTML = `
      <a href="#" class="back-link">← Cart</a>

      <!-- Left Panel -->
      <div class="left-panel">
        <div class="tabs">
          <button id="shipping-tab" class="tab active">Shipping</button>
          <button id="payment-tab" class="tab">Payment</button>
        </div>
        <form id="shipping-form" class="form-section visible">
          <div class="form-group">
            <label for="full-name">Full Name</label>
            <input type="text" id="full-name" />
          </div>
          <div class="form-group-row">
            <div class="form-group">
              <label for="street-address">Street Address</label>
              <input type="text" id="street-address" />
            </div>
            <div class="form-group">
              <label for="apt-suite">Apt/Suite</label>
              <input type="text" id="apt-suite" />
            </div>
          </div>
          <div class="form-group-row">
            <div class="form-group">
              <label for="city">City</label>
              <input type="text" id="city" />
            </div>
            <div class="form-group">
              <label for="state">State</label>
              <input type="text" id="state" />
            </div>
            <div class="form-group">
              <label for="zip-code">Zip Code</label>
              <input type="text" id="zip-code" />
            </div>
          </div>
          <div class="form-group">
            <label for="country">Country</label>
            <input type="text" id="country" />
          </div>
          <div class="form-group">
            <label for="email-address">Email Address</label>
            <input type="text" id="email-address" />
          </div>
        </form>

        <form id="payment-form" class="form-section">
          <div class="form-group">
            <label for="credit-card">Credit Card Number</label>
            <input type="text" id="credit-card" />
          </div>
          <div class="form-group-row">
            <div class="form-group">
              <label for="expiration-date">Expiration Date</label>
              <input type="text" id="expiration-date" />
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input type="text" id="cvv" />
            </div>
          </div>
          <div class="form-group">
            <label for="billing-address">Billing Address</label>
            <input type="text" id="billing-address" />
          </div>
        </form>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <h3>Review</h3>
        <div class="review-items">
          <!-- These will be dynamically generated later -->
          <p>No items in the cart yet.</p>
        </div>
        <div class="checkout-summary">
          <p>Subtotal: $<span id="subtotal">${this.#prices.subtotal.toFixed(2)}</span></p>
          <p>Shipping: $<span id="shipping">${this.#prices.shipping.toFixed(2)}</span></p>
          <p>Discount: $<span id="discount">${this.#prices.discount.toFixed(2)}</span></p>
          <p>Total: $<span id="total">${this.#prices.total.toFixed(2)}</span></p>
          <button class="pay-now">Pay Now</button>
        </div>
      </div>
    `;
  }

  #attachEventListeners() {
    const shippingTab = this.#container.querySelector('#shipping-tab');
    const paymentTab = this.#container.querySelector('#payment-tab');
    const shippingForm = this.#container.querySelector('#shipping-form');
    const paymentForm = this.#container.querySelector('#payment-form');

    shippingTab.addEventListener('click', () => {
      // Show shipping form, hide payment form
      shippingForm.classList.add('visible');
      paymentForm.classList.remove('visible');
      shippingTab.classList.add('active');
      paymentTab.classList.remove('active');
    });

    paymentTab.addEventListener('click', () => {
      // Show payment form, hide shipping form
      paymentForm.classList.add('visible');
      shippingForm.classList.remove('visible');
      paymentTab.classList.add('active');
      shippingTab.classList.remove('active');
    });

    const backLink = this.#container.querySelector('.back-link');
    backLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navigate', 'cart'); // Emit a custom navigate event to switch views
    });
  }
}

