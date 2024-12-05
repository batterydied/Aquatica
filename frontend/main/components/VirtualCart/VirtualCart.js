/*
  VirtualCart: Devin
  Description: This file handles the functionality of the virtual cart interface 
               in the frontend. It includes methods to display cart items, manage
               interactions like adding or removing items, and navigate to the checkout.
  Issue: #50
  Owner: Devin
  Expected Outcome: A fully functional virtual cart that interacts with the backend 
                    to fetch, update, and save items, and displays updated totals.

  - Constructor: Subscribes to event hub for cart actions and initializes the component.
  - Method: render(): Renders the virtual cart UI and sets up event listeners.
  - Method: #attachEventListeners(): Manages interactions like incrementing, 
             decrementing, saving, or removing items from the cart.
  - Method: #refreshCart(): Refreshes the cart and saved-for-later sections after actions.
  - Method: #generateCartItems(): Generates the HTML for cart items dynamically.
  - Method: #generateSavedItems(): Generates the HTML for saved-for-later items dynamically.
  - Method: #calculateTotals(): Calculates subtotal, shipping, tax, and total for the cart.
  - Method: #updateCartTotals(): Updates the displayed totals in the UI.
*/

// Imports
import { BaseComponent } from "../../app/BaseComponent.js";
import { AppController } from "../../app/AppController.js";
import CartEvents from "../../eventhub/CartEvents.js";
import { EventHub, hub } from "../../eventhub/EventHub.js";

// VirtualCart Class
export class VirtualCart extends BaseComponent {
  #container = null; // DOM container for the cart
  #cartItems = []; // Items currently in the cart
  #savedForLater = []; // Items saved for later

  constructor() {
    super();
    this.loadCSS("VirtualCart");

    // Subscribe to cart-related events
    hub.subscribe("cartFetched", (cartItems) => {
      this.#cartItems = cartItems;
      this.#refreshCart();
    });

    hub.subscribe("savedItemsFetched", (savedItems) => {
      this.#savedForLater = savedItems;
      this.#refreshCart();
    });

    hub.subscribe("cartItemRemoved", (itemId) => {
      this.#cartItems = this.#cartItems.filter((item) => item.id !== itemId);
      this.#refreshCart();
    });

    hub.subscribe("itemSavedForLater", (savedItem) => {
      this.#savedForLater.push(savedItem);
      this.#cartItems = this.#cartItems.filter((item) => item.id !== savedItem.id);
      this.#refreshCart();
    });

    hub.subscribe("itemMovedToCart", (movedItem) => {
      this.#cartItems.push(movedItem);
      this.#savedForLater = this.#savedForLater.filter((item) => item.id !== movedItem.id);
      this.#refreshCart();
    });

    // Subscribe to cart item updates
    hub.subscribe("cartItemUpdated", (updatedItem) => {
      const index = this.#cartItems.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        this.#cartItems[index] = updatedItem; // Update the item in the local array
        this.#refreshCart(); // Refresh the UI
      }
    });

    hub.subscribe("cartError", (errorMessage) => {
      console.error("Cart Error:", errorMessage);
    });
  }

  /**
   * Renders the virtual cart UI.
   */
  render() {
    if (!this.#container) {
      this.#container = document.createElement("div");
      this.#container.classList.add("cart-container");

      this.#container.innerHTML = `
        <div class="cart-left">
          <a href="#" class="back-link">← Marketplace</a>
          <h1>Your Cart</h1>
          <div id="cart-items">
            <p class="loading-message">Loading cart items...</p>
          </div>
          <h2>Save for Later</h2>
          <div id="saved-items">
            <p class="loading-message">Loading saved items...</p>
          </div>
        </div>
        <div class="cart-right">
          <h2>Cart Totals</h2>
          <div class="cart-totals">
            <p class="totals-row"><span class="text">Shipping:</span> <span id="shipping" class="prices">$5.99</span></p>
            <p class="totals-row"><span class="text">Tax:</span> <span id="tax" class="prices">$0.00</span></p>
            <p class="totals-row subtotal"><span class="text">Subtotal:</span> <span id="subtotal" class="prices">$0.00</span></p>
            <hr class="total-divider" />
            <p class="totals-row total"><span class="text">Total:</span> <span id="total" class="prices">$0.00</span></p>
          </div>
          <button class="checkout-button">Proceed to Checkout</button>
        </div>
      `;

      this.#attachEventListeners();
      CartEvents.fetchCart(); // Fetch cart data on render
      CartEvents.fetchSavedItems(); // Fetch saved-for-later items on render
    }

    return this.#container;
  }

  /**
   * Attaches event listeners for cart interactions.
   */
  #attachEventListeners() {
    const cartItemsContainer = this.#container.querySelector("#cart-items");
    const savedItemsContainer = this.#container.querySelector("#saved-items");
    const checkoutButton = this.#container.querySelector(".checkout-button");

    // Handle cart item actions
    cartItemsContainer.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      if (e.target.classList.contains("increment")) {
        this.#cartItems[index].quantity++;
        CartEvents.updateCartItem(this.#cartItems[index].id, this.#cartItems[index].quantity);
      } else if (e.target.classList.contains("decrement")) {
        if (this.#cartItems[index].quantity > 1) {
          this.#cartItems[index].quantity--;
          CartEvents.updateCartItem(this.#cartItems[index].id, this.#cartItems[index].quantity);
        } else {
          console.warn("Cannot decrement below 1. Quantity remains at 1.");
        }
      } else if (e.target.classList.contains("delete")) {
        CartEvents.removeFromCart(this.#cartItems[index].id);
      } else if (e.target.classList.contains("save-later")) {
        CartEvents.saveForLater(this.#cartItems[index].id);
      }
    });

    // Handle saved-for-later actions
    savedItemsContainer.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      if (e.target.classList.contains("add-to-cart")) {
        CartEvents.moveToCart(this.#savedForLater[index].id);
      }
    });

    // Handle navigation to checkout
    const backLink = this.#container.querySelector(".back-link");
    backLink.addEventListener("click", (event) => {
      event.preventDefault();
      const appController = AppController.getInstance();
      appController.navigate("marketplace");
    });

    checkoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      const cartData = {
        cartItems: this.#cartItems,
        totals: this.#calculateTotals(),
      };
      console.log("Proceeding to checkout with:", cartData);
      const appController = AppController.getInstance();
      appController.navigate("secureCheckout");
    });
  }

  /**
   * Refreshes the cart and saved-for-later UI sections.
   */
  #refreshCart() {
    const cartItemsContainer = this.#container.querySelector("#cart-items");
    const savedItemsContainer = this.#container.querySelector("#saved-items");

    cartItemsContainer.innerHTML =
      this.#cartItems.length > 0 ? this.#generateCartItems() : '<p class="empty-cart">Your cart is empty.</p>';
    savedItemsContainer.innerHTML =
      this.#savedForLater.length > 0
        ? this.#generateSavedItems()
        : '<p class="empty-saved">No items saved for later.</p>';

    this.#updateCartTotals();
  }

  /**
   * Generates the HTML for cart items.
   */
  #generateCartItems() {
    return this.#cartItems
      .map(
        (item, index) => `
        <div class="cart-item">
          <div class="item-details">
            <h4>${item.productId}</h4>
            <p>${item.description}</p>
            <p>Price: $${item.price.toFixed(2)}</p>
          </div>
          <div class="item-quantity">
            <button class="decrement" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="increment" data-index="${index}">+</button>
          </div>
          <div class="item-actions">
            <button class="save-later" data-index="${index}">Save for Later</button>
            <button class="delete" data-index="${index}">Delete</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  /**
   * Generates the HTML for saved-for-later items.
   */
  #generateSavedItems() {
    return this.#savedForLater
      .map(
        (item, index) => `
        <div class="saved-item">
          <div class="item-details">
            <h4>${item.productId}</h4>
            <p>${item.description}</p>
            <p>Price: $${item.price.toFixed(2)}</p>
          </div>
          <div class="item-actions">
            <button class="add-to-cart" data-index="${index}">Add to Cart</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  /**
   * Calculates the cart totals (subtotal, shipping, tax, total).
   */
  #calculateTotals() {
    const subtotal = this.#cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shipping = this.#cartItems.length > 0 ? 5.99 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  }

  /**
   * Updates the displayed cart totals.
   */
  #updateCartTotals() {
    const totals = this.#calculateTotals();
    this.#container.querySelector("#subtotal").textContent = `$${totals.subtotal.toFixed(2)}`;
    this.#container.querySelector("#shipping").textContent = `$${totals.shipping.toFixed(2)}`;
    this.#container.querySelector("#tax").textContent = `$${totals.tax.toFixed(2)}`;
    this.#container.querySelector("#total").textContent = `$${totals.total.toFixed(2)}`;
  }
}

