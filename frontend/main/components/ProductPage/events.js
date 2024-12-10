function updatePrice(max){
    let amount = parseInt(document.getElementById('quantity-input').value) || 1;
    if(amount < 1){
        document.getElementById('quantity-input').value = 1;
    }
    if(max && amount > max){
        document.getElementById('quantity-input').value = max;
    }
    const price = document.getElementById('price');
    const originalPrice = price.dataset.originalPrice;
    price.innerText = (originalPrice * amount).toFixed(2);
}

function handleIncrease(max) {
    const quantityInput = document.getElementById('quantity-input');
    const amount = parseInt(quantityInput.value) || 1;
    if(max && amount < max){
      quantityInput.value = amount + 1;
    }
}

function handleDecrease() {
    const quantityInput = document.getElementById('quantity-input');
    const amount = parseInt(quantityInput.value) || 1;
    if(amount > 1){
        quantityInput.value = amount - 1;
    }
}

async function handleAddToCart(product, quantity) {
    const cartItem = {
      name: product.name,
      productId: product.prodid,
      price: product.price, // Assuming a static price for demonstration; replace with actual data
      description: product.description, // Replace with actual product description
      quantity: quantity, 
      userId: "test-user-id", // Replace with the current user ID dynamically
      isSaved: false
    };
  
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cartItem)
      });
  
      if (response.ok) {
        alert("Added to cart!");
      } else {
        alert("Failed to add to cart. Please try again.");
        console.error("Failed to add item:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred. Please try again later.");
    }
  }
  

export { handleIncrease, updatePrice, handleDecrease, handleAddToCart };
