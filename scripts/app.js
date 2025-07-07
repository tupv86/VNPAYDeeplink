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


function checkout() {
  // Tìm input đang được chọn
  const method = document.querySelector('input[name="payment-method"]:checked').value;

  if (method === 'direct') {
    alert('Thanh toán trực tiếp.');
  } else if (method === 'vnpay-payment') {
    window.location.href = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...';
  } else if (method === 'vnpay-deeplink') {
    document.getElementById('deeplink-section').style.display = 'block';
    renderBankList();
  }
}


loadCart();
renderCart();
loadProducts();
