function updatePrice(){
    let amount = parseInt(document.getElementById('quantity-input').value) || 1;
    if(amount < 1){
        amount = 1;
        document.getElementById('quantity-input').value = 1;
    }
    const price = document.getElementById('price');
    const originalPrice = price.dataset.originalPrice;
    price.innerText = (originalPrice * amount).toFixed(2);
}

function handleIncrease() {
    const quantityInput = document.getElementById('quantity-input');
    const amount = parseInt(quantityInput.value) || 1;
    quantityInput.value = amount + 1;
}

function handleDecrease() {
    const quantityInput = document.getElementById('quantity-input');
    const amount = parseInt(quantityInput.value) || 1;
    if(amount > 1){
        quantityInput.value = amount - 1;
    }
}

function handleAddToCart(){
    alert('Added to cart!');
}

export { handleIncrease, updatePrice, handleDecrease, handleAddToCart };
