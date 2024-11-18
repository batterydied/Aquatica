// import { SecureCheckout } from "../components/SecureCheckout/SecureCheckout.js"; // Commented out import

import { BaseComponent } from "../../app/BaseComponent.js";
import { CartService } from "../../services/CartService.js";

export class VirtualCart extends BaseComponent {
  #container = null;
  #cartItems = [];

  constructor() {
    super();
    this.loadCSS("VirtualCart");

    // Temporary placeholder data
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
      {
        id: 3,
        name: "Sample Product 3",
        description: "A third placeholder product.",
        quantity: 3,
        price: 9.99,
      },
    ];
  }

  render() {
    if (!this.#container) {
      this.#container = document.createElement("div");
      this.#container.classList.add("cart-container");

      // Define the cart's structure
      this.#container.innerHTML = `
        <div class="cart-left">
          <a href="#" class="back-link">← Back</a>
          <h2>Your Cart</h2>
          <div id="cart-items">
            ${
              this.#cartItems.length > 0
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

      this.#attachEventListeners();
      this.#updateCartTotals();
    }

    return this.#container;
  }

  #attachEventListeners() {
    const cartItemsContainer = this.#container.querySelector("#cart-items");

    cartItemsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("increment")) {
        const index = e.target.dataset.index;
        this.#cartItems[index].quantity++;
        this.#refreshCart();
      }

      if (e.target.classList.contains("decrement")) {
        const index = e.target.dataset.index;
        if (this.#cartItems[index].quantity > 1) {
          this.#cartItems[index].quantity--;
        } else {
          this.#cartItems.splice(index, 1);
        }
        this.#refreshCart();
      }
    });

    const checkoutButton = this.#container.querySelector(".checkout-button");
    checkoutButton.addEventListener("click", () => {
      console.log("Navigating to secure checkout...");
      // Uncomment this section when SecureCheckout is implemented
      /*
      const appController = AppController.getInstance();
      appController.navigate("secureCheckout");
      */
    });
  }

  #refreshCart() {
    const cartItemsContainer = this.#container.querySelector("#cart-items");
    cartItemsContainer.innerHTML = this.#generateCartItems();
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
          <div class="item-price">
            $${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      `
      )
      .join("");
  }

  #updateCartTotals() {
    const subtotal = this.#cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shipping = this.#cartItems.length > 0 ? 5.99 : 0;
    const tax = subtotal * 0.1; // Example tax calculation (10%)
    const total = subtotal + shipping + tax;

    this.#container.querySelector("#subtotal").textContent = `$${subtotal.toFixed(2)}`;
    this.#container.querySelector("#shipping").textContent = `$${shipping.toFixed(2)}`;
    this.#container.querySelector("#tax").textContent = `$${tax.toFixed(2)}`;
    this.#container.querySelector("#total").textContent = `$${total.toFixed(2)}`;
  }
}

