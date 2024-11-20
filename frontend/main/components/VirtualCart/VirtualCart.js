import { BaseComponent } from "../../app/BaseComponent.js";
import { AppController } from "../../app/AppController.js";
import { hub } from "../../eventhub/EventHub.js";

export class VirtualCart extends BaseComponent {
  #container = null;
  #cartItems = [];
  #savedForLater = [];

  constructor() {
    super();
    this.loadCSS("VirtualCart");

    // Temporary placeholder data for the cart
    this.#cartItems = [
      {
        id: 1,
        name: "Sample Product 1",
        description: "This is a placeholder product.",
        quantity: 2,
        price: 19.99,
      },
      {
        id: 2,
        name: "Sample Product 2",
        description: "Another placeholder product.",
        quantity: 1,
        price: 39.99,
      },
    ];

    // Temporary placeholder data for Save for Later
    this.#savedForLater = [
      {
        id: 3,
        name: "Sample Product 3",
        description: "This product is saved for later.",
        price: 9.99,
      },
    ];
  }

  render() {
    if (!this.#container) {
      this.#container = document.createElement("div");
      this.#container.classList.add("cart-container");

      this.#container.innerHTML = `
        <div class="cart-left">
          <a href="#" class="back-link">← Marketplace</a>
          <h2>Your Cart</h2>
          <div id="cart-items">
            ${
              this.#cartItems.length > 0
                ? this.#generateCartItems()
                : '<p class="empty-cart">Your cart is empty.</p>'
            }
          </div>
          <h3>Save for Later</h3>
          <div id="saved-items">
            ${
              this.#savedForLater.length > 0
                ? this.#generateSavedItems()
                : '<p class="empty-saved">No items saved for later.</p>'
            }
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
      this.#updateCartTotals();
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
        this.#refreshCart();
      } else if (e.target.classList.contains("decrement")) {
        if (this.#cartItems[index].quantity > 1) {
          this.#cartItems[index].quantity--;
        } else {
          this.#cartItems.splice(index, 1);
        }
        this.#refreshCart();
      } else if (e.target.classList.contains("delete")) {
        this.#cartItems.splice(index, 1);
        this.#refreshCart();
      } else if (e.target.classList.contains("save-later")) {
        const item = this.#cartItems[index];
        this.#savedForLater.push({ ...item });
        this.#cartItems.splice(index, 1);
        this.#refreshCart();
      }
    });

    // Handle saved-for-later actions
    savedItemsContainer.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      if (e.target.classList.contains("add-to-cart")) {
        const item = this.#savedForLater[index];
        this.#cartItems.push({ ...item, quantity: item.quantity || 1 });
        this.#savedForLater.splice(index, 1);
        this.#refreshCart();
      }
    });

    // Handle navigation to checkout
    checkoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      hub.publish("cartData", {
        cartItems: this.#cartItems,
        totals: this.#calculateTotals(),
      });
      const appController = AppController.getInstance();
      appController.navigate("secureCheckout");
    });
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

  #refreshCart() {
    const cartItemsContainer = this.#container.querySelector("#cart-items");
    const savedItemsContainer = this.#container.querySelector("#saved-items");

    cartItemsContainer.innerHTML = this.#generateCartItems();
    savedItemsContainer.innerHTML = this.#generateSavedItems();

    this.#updateCartTotals();
  }

  #generateCartItems() {
    return this.#cartItems
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
          <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          <div class="item-actions">
            <button class="save-later" data-index="${index}">Save</button>
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
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <p>Quantity: ${item.quantity || 1}</p>
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

  #updateCartTotals() {
    const totals = this.#calculateTotals();
    this.#container.querySelector("#subtotal").textContent = `$${totals.subtotal.toFixed(2)}`;
    this.#container.querySelector("#shipping").textContent = `$${totals.shipping.toFixed(2)}`;
    this.#container.querySelector("#tax").textContent = `$${totals.tax.toFixed(2)}`;
    this.#container.querySelector("#total").textContent = `$${totals.total.toFixed(2)}`;
  }
}

