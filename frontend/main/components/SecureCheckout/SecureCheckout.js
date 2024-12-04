import { BaseComponent } from "../../app/BaseComponent.js";
import { AppController } from "../../app/AppController.js";
import { hub } from "../../eventhub/EventHub.js";

export class SecureCheckout extends BaseComponent {
  #container = null;
  #prices = {
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  };

  constructor() {
    super();
    this.loadCSS("SecureCheckout");

    hub.subscribe("cartData", (data) => {
      // Wait for the container to render before updating the review
      if (this.#container) {
        this.#updateCartReview(data.cartItems, data.totals);
      } else {
        setTimeout(() => this.#updateCartReview(data.cartItems, data.totals), 0);
      }
    });
  }

  render() {
    if (this.#container) {
      return this.#container;
    }

    this.#container = document.createElement("div");
    this.#container.classList.add("checkout-container");
    this.#setupContainerContent();
    this.#attachEventListeners();

    return this.#container;
  }

  #setupContainerContent() {
    this.#container.innerHTML = `
      <a href="#" class="back-link">← Cart</a>
      <div class="left-panel">
        <div class="tabs">
          <button id="shipping-tab" class="tab active">Shipping</button>
          <button id="payment-tab" class="tab">Payment</button>
        </div>
        <form id="shipping-form" class="form-section visible">
          <div class="form-group">
            <label for="full-name">Full Name</label>
            <input type="text" id="full-name" required />
          </div>
          <div class="form-group-row">
            <div class="form-group">
              <label for="street-address">Street Address</label>
              <input type="text" id="street-address" required />
            </div>
            <div class="form-group">
              <label for="apt-suite">Apt/Suite</label>
              <input type="text" id="apt-suite" />
            </div>
          </div>
          <div class="form-group-row">
            <div class="form-group">
              <label for="city">City</label>
              <input type="text" id="city" required />
            </div>
            <div class="form-group">
              <label for="state">State</label>
              <input type="text" id="state" required />
            </div>
            <div class="form-group">
              <label for="zip-code">Zip Code</label>
              <input type="text" id="zip-code" required />
            </div>
          </div>
          <div class="form-group">
            <label for="country">Country</label>
            <input type="text" id="country" required />
          </div>
          <div class="form-group">
            <label for="email-address">Email Address</label>
            <input type="email" id="email-address" required />
          </div>
        </form>
        <form id="payment-form" class="form-section">
          <div class="form-group">
            <label for="credit-card">Credit Card Number</label>
            <input type="text" id="credit-card" maxlength="16" minlength="16" required />
          </div>
          <div class="form-group-row">
            <div class="form-group">
              <label for="expiration-date">Expiration Date (MM/YY)</label>
              <input type="text" id="expiration-date" maxlength="5" required />
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input type="text" id="cvv" maxlength="3" minlength="3" required />
            </div>
          </div>
          <div class="form-group">
            <label for="billing-address">Billing Address</label>
            <input type="text" id="billing-address" required />
          </div>
        </form>
      </div>
      <div class="right-panel">
        <h3>Review</h3>
        <div class="review-items">
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
    const shippingTab = this.#container.querySelector("#shipping-tab");
    const paymentTab = this.#container.querySelector("#payment-tab");
    const shippingForm = this.#container.querySelector("#shipping-form");
    const paymentForm = this.#container.querySelector("#payment-form");
    const payNowButton = this.#container.querySelector(".pay-now");

    shippingTab.addEventListener("click", () => {
      shippingForm.classList.add("visible");
      paymentForm.classList.remove("visible");
      shippingTab.classList.add("active");
      paymentTab.classList.remove("active");
    });

    paymentTab.addEventListener("click", () => {
      paymentForm.classList.add("visible");
      shippingForm.classList.remove("visible");
      paymentTab.classList.add("active");
      shippingTab.classList.remove("active");
    });

    payNowButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.#validateAndSubmit();
    });

    const backLink = this.#container.querySelector(".back-link");
    backLink.addEventListener("click", (event) => {
      event.preventDefault();
      const appController = AppController.getInstance();
      appController.navigate("virtualCart");
    });
  }

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
      } else if (
        field.hasAttribute("maxlength") &&
        field.value.length !== parseInt(field.getAttribute("maxlength"))
      ) {
        errors.push(
          `${field.previousElementSibling.textContent} must be ${field.getAttribute(
            "maxlength"
          )} characters long.`
        );
      }
    });

    const expirationDate = this.#container.querySelector("#expiration-date").value;
    if (expirationDate && !/^\d{2}\/\d{2}$/.test(expirationDate)) {
      errors.push("Expiration Date must be in the format MM/YY.");
    }

    if (errors.length > 0) {
      alert(`Please fix the following errors:\n\n${errors.join("\n")}`);
    } else {
      alert("Purchase Successful");
    }
  }

  #updateCartReview(cartItems, totals) {
    const reviewItemsContainer = this.#container.querySelector(".review-items");
    const subtotalEl = this.#container.querySelector("#subtotal");
    const shippingEl = this.#container.querySelector("#shipping");
    const totalEl = this.#container.querySelector("#total");

    // Ensure elements exist before updating
    if (!reviewItemsContainer || !subtotalEl || !shippingEl || !totalEl) {
      console.error("Some elements are missing in the DOM.");
      return;
    }

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
