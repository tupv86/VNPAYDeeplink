let products = [];

async function loadProducts() {
  const res = await fetch('/data/products.json');
  products = await res.json();
  renderProducts();
}

function renderProducts() {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h4>${p.name}</h4>
      <p>Giá: ${p.price} VND</p>
      <button onclick='addToCart(${JSON.stringify(p)})'>Thêm giỏ</button>
    `;
    list.appendChild(div);
  });
}

async function checkCartStatusOnLoad() {
  const lastOrderId = localStorage.getItem('lastOrderId'); // Hoặc bạn lưu orderId khi tạo link
  if (lastOrderId) {
    const res = await fetch(`https://script.google.com/macros/s/AKfycbw9nAJs9S_-hr6KwZz9YgYCNmpbvogUwi_i8XPnUhiCrZ8xpniN_rOrt3uLSCDEVgCmgg/exec?action=getOrderStatus&orderId=${lastOrderId}`);
    const data = await res.json();
    if (data.status === 'success') {
      localStorage.removeItem('cart');
      localStorage.removeItem('lastOrderId');
      console.log("Đã clear giỏ hàng vì đơn đã success!");
    }
  }
}

(async () => {
  await checkCartStatusOnLoad();
  loadCart();
  renderCart();
  loadProducts();
})();