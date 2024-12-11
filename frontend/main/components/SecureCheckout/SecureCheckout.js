/*
  SecureCheckout: Devin
  Description: This file serves as the checkout page interface, enabling users
               to review their cart, enter shipping and payment details, and 
               place an order. Integrates with the backend for order processing.
  Issue: #50
  Owner: Devin
  Expected Outcome: A fully functional checkout page that:
                    - Fetches cart details directly from the backend.
                    - Validates user input for shipping and payment details.
                    - Sends valid orders to the backend upon submission.
*/

// Imports
import { BaseComponent } from "../../app/BaseComponent.js";
import { AppController } from "../../app/AppController.js";
import CartEvents from "../../eventhub/CartEvents.js";


// SecureCheckout Class
export class SecureCheckout extends BaseComponent {
  #container = null;
  #prices = {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  };
  #cartItems = []; // Private field to store cart items

  constructor() {
    super();
    this.loadCSS("SecureCheckout");
  }

  render() {
    if (this.#container) {
      this.#fetchCartData();
      return this.#container;
    }

    this.#container = document.createElement("div");
    this.#container.classList.add("checkout-container");
    this.#setupContainerContent();
    this.#attachEventListeners();
    this.#fetchCartData();

    return this.#container;
  }

  // Method to call after order is placed and you leave the page.
  #resetCheckoutView() {
    this.#container.innerHTML = "";
    this.#setupContainerContent();
    this.#attachEventListeners();
    this.#fetchCartData();
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
          <p>Total: $<span id="total">${this.#prices.total.toFixed(2)}</span></p>
          <p>Shipping: $<span id="shipping">${this.#prices.shipping.toFixed(2)}</span></p>
          <p>Tax: $<span id="tax">${this.#prices.tax.toFixed(2)}</span></p>
          <p>Subtotal: $<span id="subtotal">${this.#prices.subtotal.toFixed(2)}</span></p>
          <button class="pay-now">Pay Now</button>
        </div>
      </div>
    `;
  }

  // Listens for any events on click we need.
  #attachEventListeners() {
    const shippingTab = this.#container.querySelector("#shipping-tab");
    const paymentTab = this.#container.querySelector("#payment-tab");
    const payNowButton = this.#container.querySelector(".pay-now");
    const backLink = this.#container.querySelector(".back-link");

    shippingTab.addEventListener("click", () => this.#toggleForm("shipping"));
    paymentTab.addEventListener("click", () => this.#toggleForm("payment"));

    payNowButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.#validateAndSubmit();
    });

    backLink.addEventListener("click", (event) => {
      event.preventDefault();
      const appController = AppController.getInstance();
      appController.navigate("virtualCart");
    });
  }

  // Handles view rendering from shipping to payment.
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

  // Gets the info needed from cart to make a review, and order.
  async #fetchCartData() {
    const appController = AppController.getInstance();
    const currentViewParams = appController.currentViewParams || {};

    if (currentViewParams.items && Array.isArray(currentViewParams.items)) {
      const items = currentViewParams.items;
      const totals = this.#calculateTotalsFromItems(items);
      this.#updateCartReview(items, totals);
      this.#cartItems = items; // Add this line
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart data");
      const { items } = await response.json();
      const totals = this.#calculateTotalsFromItems(items);
      this.#updateCartReview(items, totals);
      this.#cartItems = items; // Add this line
    } catch (error) {
      console.error("Error fetching cart data:", error);
      alert("Failed to load cart data.");
    }
  }
  


  // Finds the cart review numbers.
  #calculateTotalsFromItems(items) {
    const total = items.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
    const shipping = items.length > 0 ? 5.99 : 0;
    const tax = total * 0.1;
    const subtotal = total + shipping + tax;
    return { subtotal, shipping, tax, total };
  }

  // Sets the cart review numbers.
  #updateCartReview(cartItems, totals) {
    const reviewItemsContainer = this.#container.querySelector(".review-items");
    const subtotalEl = this.#container.querySelector("#subtotal");
    const shippingEl = this.#container.querySelector("#shipping");
    const taxEl = this.#container.querySelector("#tax");
    const totalEl = this.#container.querySelector("#total");
    const payNowButton = this.#container.querySelector(".pay-now");

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

    taxEl.textContent = totals.tax.toFixed(2);
    subtotalEl.textContent = totals.subtotal.toFixed(2);
    shippingEl.textContent = totals.shipping.toFixed(2);
    totalEl.textContent = totals.total.toFixed(2);

    // Disable "Pay Now" if cart is empty
    payNowButton.disabled = cartItems.length === 0;
  }


  // Makes sure every feild (I want filled) is filled out (could be more strict).
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

  // Handles the backend logic for making a new order.
  #submitOrder() {
    const orderItems = this.#cartItems.map((item) => ({
      productId: item.productId,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
    }));

    fetch("http://localhost:3000/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orders: orderItems }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to place order");
        return response.json();
      })
      .then(() => this.#showOrderConfirmation())
      .catch((error) => alert("Failed to place order: " + error.message));
  }

  // Render a confirmation after purchase.
  #showOrderConfirmation() {
    this.#container.innerHTML = `
      <div class="order-confirmation">
        <h1>Thanks for ordering from Aquatica</h1>
        <p>Your order was successfully placed.</p>
        <button class="return-marketplace">Return to Marketplace</button>
      </div>
    `;

    const returnButton = this.#container.querySelector(".return-marketplace");
    returnButton.addEventListener("click", () => {
      this.#clearCart(); // Clear cart not saved items
      const appController = AppController.getInstance();
      this.#resetCheckoutView(); // Reset the view
      appController.navigate("marketplace");
    });
  }

  // Used for clearing cart after purchase.
  #clearCart() {
    fetch("http://localhost:3000/api/cart", {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to clear cart");
        CartEvents.fetchCart(); // Ensure the frontend updates as well
      })
      .catch((error) => console.error("Failed to clear cart:", error));
  }

}

