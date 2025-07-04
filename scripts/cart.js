let cart = [];

function addToCart(product) {
  cart.push(product);
  saveCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function loadCart() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
}

function calculateCartTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function renderCart() {
  const cartList = document.getElementById('cart-list');
  cartList.innerHTML = '';
  cart.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ${item.price} VND`;
    li.onclick = () => removeFromCart(i);
    cartList.appendChild(li);
  });
  document.getElementById('cart-count').textContent = cart.length;
  document.getElementById('cart-total').textContent = calculateCartTotal();
}
