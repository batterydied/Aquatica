// Imports
import { BaseComponent } from "../../app/BaseComponent.js";
import CartEvents from "../../eventhub/CartEvents.js";
import EventHub from "../../eventhub/EventHub.js";

export class VirtualCart extends BaseComponent {
  #container = null;
  #cartItems = [];
  #savedForLater = [];

  constructor() {
    super();
    this.loadCSS("VirtualCart");

    // Subscribe to cart-related events
    EventHub.subscribe("cartFetched", (cartItems) => {
      this.#cartItems = cartItems;
      this.#refreshCart();
    });

    EventHub.subscribe("savedItemsFetched", (savedItems) => {
      this.#savedForLater = savedItems;
      this.#refreshCart();
    });

    EventHub.subscribe("cartItemRemoved", (itemId) => {
      this.#cartItems = this.#cartItems.filter((item) => item.id !== itemId);
      this.#refreshCart();
    });

    EventHub.subscribe("itemSavedForLater", (savedItem) => {
      this.#savedForLater.push(savedItem);
      this.#cartItems = this.#cartItems.filter((item) => item.id !== savedItem.id);
      this.#refreshCart();
    });

    EventHub.subscribe("itemMovedToCart", (movedItem) => {
      this.#cartItems.push(movedItem);
      this.#savedForLater = this.#savedForLater.filter((item) => item.id !== movedItem.id);
      this.#refreshCart();
    });

    EventHub.subscribe("cartError", (errorMessage) => {
      console.error("Cart Error:", errorMessage);
    });
  }

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
          <h3>Cart Totals</h3>
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
          CartEvents.removeFromCart(this.#cartItems[index].id);
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
    checkoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      const cartData = {
        cartItems: this.#cartItems,
        totals: this.#calculateTotals(),
      };
      console.log("Proceeding to checkout with:", cartData);
      // Trigger navigation or send data to backend
    });
  }

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

  #generateCartItems() {
    return this.#cartItems
      .map(
        (item, index) => `
        <div class="cart-item">
          <div class="item-details">
            <h4>${item.productId}</h4>
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

  #generateSavedItems() {
    return this.#savedForLater
      .map(
        (item, index) => `
        <div class="saved-item">
          <div class="item-details">
            <h4>${item.productId}</h4>
          </div>
          <div class="item-actions">
            <button class="add-to-cart" data-index="${index}">Add to Cart</button>
          </div>
        </div>
      `
      )
      .join("");
  }

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

  #updateCartTotals() {
    const totals = this.#calculateTotals();
    this.#container.querySelector("#subtotal").textContent = `$${totals.subtotal.toFixed(2)}`;
    this.#container.querySelector("#shipping").textContent = `$${totals.shipping.toFixed(2)}`;
    this.#container.querySelector("#tax").textContent = `$${totals.tax.toFixed(2)}`;
    this.#container.querySelector("#total").textContent = `$${totals.total.toFixed(2)}`;
  }
}

