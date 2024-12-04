/*
  SecureCheckout: Devin
  Description: This file serves as the checkout page interface, enabling users
               to review their cart, enter shipping and payment details, and 
               place an order. Integrates with the backend for order processing.
  Issue: #50
  Owner: Devin
  Expected Outcome: A fully functional checkout page that:
                    - Displays cart details fetched from VirtualCart.
                    - Validates user input for shipping and payment details.
                    - Sends valid orders to the backend upon submission.

  Integrates with:
  - VirtualCart: Receives cart data published on checkout.
  - Backend: Sends order data to the API for processing.

  - Method: render(): Creates the checkout page layout.
  - Method: #updateCartReview(): Updates the UI with cart details.
  - Method: #validateAndSubmit(): Validates user input and triggers order submission.
  - Method: #submitOrder(): Sends order data to the backend.
*/

// Imports
import { BaseComponent } from "../../app/BaseComponent.js";
import { AppController } from "../../app/AppController.js";
import { hub } from "../../eventhub/EventHub.js";

// SecureCheckout Class
export class SecureCheckout extends BaseComponent {
  // Private Variables
  #container = null;
  #prices = {
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  };

  /**
   * Constructor for SecureCheckout.
   * Subscribes to cart data updates and loads necessary styles.
   */
  constructor() {
    super();
    this.loadCSS("SecureCheckout");

    // Subscribe to cart data updates
    hub.subscribe("cartData", (data) => {
      if (this.#container) {
        this.#updateCartReview(data.cartItems, data.totals);
      } else {
        setTimeout(() => this.#updateCartReview(data.cartItems, data.totals), 0);
      }
    });
  }

  /**
   * Render the checkout page layout.
   * @returns {HTMLElement} - The checkout container element.
   */
  render() {
    if (this.#container) return this.#container;

    this.#container = document.createElement("div");
    this.#container.classList.add("checkout-container");
    this.#setupContainerContent();
    this.#attachEventListeners();

    return this.#container;
  }

  /**
   * Setup the initial HTML content for the checkout page.
   */
  #setupContainerContent() {
    this.#container.innerHTML = `
      <a href="#" class="back-link">← Cart</a>
      <div class="left-panel">
        <div class="tabs">
          <button id="shipping-tab" class="tab active">Shipping</button>
          <button id="payment-tab" class="tab">Payment</button>
        </div>
        <form id="shipping-form" class="form-section visible">
          <div class="form-group"><label for="full-name">Full Name</label><input type="text" id="full-name" required /></div>
          <div class="form-group-row">
            <div class="form-group"><label for="street-address">Street Address</label><input type="text" id="street-address" required /></div>
            <div class="form-group"><label for="apt-suite">Apt/Suite</label><input type="text" id="apt-suite" /></div>
          </div>
          <div class="form-group-row">
            <div class="form-group"><label for="city">City</label><input type="text" id="city" required /></div>
            <div class="form-group"><label for="state">State</label><input type="text" id="state" required /></div>
            <div class="form-group"><label for="zip-code">Zip Code</label><input type="text" id="zip-code" required /></div>
          </div>
          <div class="form-group"><label for="country">Country</label><input type="text" id="country" required /></div>
          <div class="form-group"><label for="email-address">Email Address</label><input type="email" id="email-address" required /></div>
        </form>
        <form id="payment-form" class="form-section">
          <div class="form-group"><label for="credit-card">Credit Card Number</label><input type="text" id="credit-card" maxlength="16" minlength="16" required /></div>
          <div class="form-group-row">
            <div class="form-group"><label for="expiration-date">Expiration Date (MM/YY)</label><input type="text" id="expiration-date" maxlength="5" required /></div>
            <div class="form-group"><label for="cvv">CVV</label><input type="text" id="cvv" maxlength="3" minlength="3" required /></div>
          </div>
          <div class="form-group"><label for="billing-address">Billing Address</label><input type="text" id="billing-address" required /></div>
        </form>
      </div>
      <div class="right-panel">
        <h3>Review</h3>
        <div class="review-items"><p>No items in the cart yet.</p></div>
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

  /**
   * Attach event listeners to the checkout page elements.
   */
  #attachEventListeners() {
    const shippingTab = this.#container.querySelector("#shipping-tab");
    const paymentTab = this.#container.querySelector("#payment-tab");
    const payNowButton = this.#container.querySelector(".pay-now");
    const backLink = this.#container.querySelector(".back-link");

    // Tab switching logic
    shippingTab.addEventListener("click", () => {
      this.#toggleForm("shipping");
    });
    paymentTab.addEventListener("click", () => {
      this.#toggleForm("payment");
    });

    // Handle Pay Now button
    payNowButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.#validateAndSubmit();
    });

    // Navigate back to cart
    backLink.addEventListener("click", (event) => {
      event.preventDefault();
      const appController = AppController.getInstance();
      appController.navigate("virtualCart");
    });
  }

  /**
   * Toggle between shipping and payment forms.
   * @param {string} form - The form to display ("shipping" or "payment").
   */
  #toggleForm(form) {
    const shippingForm = this.#container.querySelector("#shipping-form");
    const paymentForm = this.#container.querySelector("#payment-form");
    const shippingTab = this.#container.querySelector("#shipping-tab");
    const paymentTab = this.#container.querySelector("#payment-tab");

    if (form === "shipping") {
      shippingForm.classList.add("visible");
      paymentForm.classList.remove("visible");
      shippingTab.classList.add("active");
      paymentTab.classList.remove("active");
    } else {
      paymentForm.classList.add("visible");
      shippingForm.classList.remove("visible");
      paymentTab.classList.add("active");
      shippingTab.classList.remove("active");
    }
  }

  /**
   * Validate the user input and submit the order if valid.
   */
  #validateAndSubmit() {
    const requiredFields = [
      "#full-name",
      "#street-address",
      "#city",
      "#state",
      "#zip-code",
      "#country",
      "#email-address",
      "#credit-card",
      "#expiration-date",
      "#cvv",
      "#billing-address",
    ];
    const errors = [];
    requiredFields.forEach((selector) => {
      const field = this.#container.querySelector(selector);
      if (!field.value || (field.hasAttribute("required") && field.value.trim() === "")) {
        errors.push(`${field.previousElementSibling.textContent} is required.`);
      }
    });

    if (errors.length > 0) {
      alert(`Please fix the following errors:\n\n${errors.join("\n")}`);
    } else {
      this.#submitOrder();
    }
  }

/**
 * Submit the order data to the backend.
 */
#submitOrder() {
  const orders = this.#container.querySelectorAll(".review-item");
  const orderItems = Array.from(orders).map((order) => {
    const productIdEl = order.querySelector("h4");
    const descriptionEl = order.querySelector("p");
    const priceEl = order.querySelector("p + p");
    const quantityEl = order.querySelector(".item-quantity span");

    // Check for missing elements
    if (!productIdEl || !descriptionEl || !priceEl || !quantityEl) {
      console.error("Order item structure is incorrect or missing elements:", order);
      return null; // Skip this item if structure is invalid
    }

    return {
      productId: productIdEl.textContent,
      description: descriptionEl.textContent,
      price: parseFloat(priceEl.textContent.replace("$", "")),
      quantity: parseInt(quantityEl.textContent),
    };
  });

  // Filter out invalid items
  const validOrderItems = orderItems.filter((item) => item !== null);

  if (validOrderItems.length === 0) {
    alert("No valid order items to submit.");
    return;
  }

  fetch("http://localhost:3000/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validOrderItems),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to place order");
      return response.json();
    })
    .then(() => alert("Order placed successfully!"))
    .catch((error) => alert("Failed to place order: " + error.message));
}


  /**
   * Update the cart review section with cart details.
   * @param {Array} cartItems - Items in the cart.
   * @param {Object} totals - Totals (subtotal, shipping, total).
   */
  #updateCartReview(cartItems, totals) {
    const reviewItemsContainer = this.#container.querySelector(".review-items");
    const subtotalEl = this.#container.querySelector("#subtotal");
    const shippingEl = this.#container.querySelector("#shipping");
    const totalEl = this.#container.querySelector("#total");

    reviewItemsContainer.innerHTML = cartItems
      .map(
        (item) => `
        <div class="review-item">
          <p><strong>${item.name}</strong> x ${item.quantity}</p>
          <p>$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `
      )
      .join("");

    subtotalEl.textContent = totals.subtotal.toFixed(2);
    shippingEl.textContent = totals.shipping.toFixed(2);
    totalEl.textContent = totals.total.toFixed(2);
  }
}

