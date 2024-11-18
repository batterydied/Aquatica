export class CartService {
  constructor() {
    this.cartItems = []; // In-memory storage for cart items
  }

  saveCartItem(item) {
    const existingItemIndex = this.cartItems.findIndex((cartItem) => cartItem.id === item.id);
    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      this.cartItems[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      this.cartItems.push(item);
    }
    console.log("Cart items after save:", this.cartItems);
  }

  retrieveCartItems() {
    return this.cartItems; // Return in-memory items
  }

  deleteCartItem(id) {
    this.cartItems = this.cartItems.filter((item) => item.id !== id);
    console.log("Cart items after delete:", this.cartItems);
  }

  clearCart() {
    this.cartItems = []; // Clear in-memory cart
    console.log("Cart cleared");
  }
}

