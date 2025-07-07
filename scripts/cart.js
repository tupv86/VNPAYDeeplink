// ================= CART ===================
let cart = [];

// Thêm sản phẩm vào giỏ
function addToCart(product) {
  const existing = cart.find((p) => p.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
}

function increaseQuantity(index) {
  if (cart[index].quantity === undefined || isNaN(cart[index].quantity)) {
    cart[index].quantity = 1; // fallback nếu dữ liệu lỗi
  }
  cart[index].quantity += 1;
  saveCart();
}

function decreaseQuantity(index) {
  if (cart[index].quantity === undefined || isNaN(cart[index].quantity)) {
    cart[index].quantity = 1; // fallback
  }
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
}

// Save + Render
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function loadCart() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
}

function calculateCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Render header + chi tiết
function renderCart() {
  // Header info
  console.log("DEBUG cart:", cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = totalItems;
  document.getElementById("cart-total").textContent = calculateCartTotal();

  // Chi tiết
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-qty-price">${item.price} VND x ${item.quantity}</span>
      <span class="cart-item-controls">
        <button onclick="decreaseQuantity(${i})">➖</button>
        <button onclick="increaseQuantity(${i})">➕</button>
      </span>
    `;

    cartList.appendChild(li);
  });
}

// ================= CART TOGGLE ===================
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderCart();

  document.getElementById("view-cart-btn").addEventListener("click", () => {
    const details = document.getElementById("cart-details");
    details.style.display = details.style.display === "none" ? "block" : "none";
  });
});
