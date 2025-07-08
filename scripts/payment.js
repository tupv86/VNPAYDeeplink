// Gán event change cho radio button
document.querySelectorAll('input[name="payment-method"]').forEach(input => {
  input.addEventListener('change', handleMethodChange);
});

function handleMethodChange() {
  const method = document.querySelector('input[name="payment-method"]:checked').value;
  document.getElementById('payment-button').style.display = 'none';
  document.getElementById('token-form-section').style.display = 'none';
  document.getElementById('deeplink-section').style.display = 'none';
  document.getElementById('checkout-info').style.display = 'block';
  if (method === 'vnpay-payment') {
    document.getElementById('payment-button').style.display = 'inline-block';
  } else if (method === 'vnpay-token') {
    document.getElementById('token-form-section').style.display = 'block';
  } else if (method === 'vnpay-deeplink') {
    document.getElementById('deeplink-section').style.display = 'block';
    renderBankList(); // Gọi từ bankDeeplink.js
  }
}


async function handlePayment() {

  const customerInfo = {
  name: document.getElementById('customer-name').value.trim(),
  phone: document.getElementById('customer-phone').value.trim(),
  email: document.getElementById('customer-email').value.trim(),
  address: document.getElementById('customer-address').value.trim()
  };
  if (!customerInfo.name || !customerInfo.phone || !customerInfo.email || !customerInfo.address) {
  alert('Vui lòng nhập đầy đủ thông tin khách hàng.');
  return;
  }
  const amount = calculateCartTotal();
  const orderId = Date.now();
  localStorage.setItem('lastOrderId', orderId);
  const orderInfo = cart.map(item => `${item.id}_${item.quantity}`).join(',');
 
  const url = `https://script.google.com/macros/s/AKfycbw9nAJs9S_-hr6KwZz9YgYCNmpbvogUwi_i8XPnUhiCrZ8xpniN_rOrt3uLSCDEVgCmgg/exec?action=getPaymentUrl&amount=${amount}&orderId=${orderId}&orderInfo=${encodeURIComponent(orderInfo)}&customerName=${encodeURIComponent(customerInfo.name)}&customerPhone=${encodeURIComponent(customerInfo.phone)}&customerEmail=${encodeURIComponent(customerInfo.email)}&customerAddress=${encodeURIComponent(customerInfo.address)}`;

  const response = await fetch(url);
  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Có lỗi khi tạo link thanh toán");
  }
}


function onCommandChange() {
  const command = document.getElementById('vnp_command').value;
  document.getElementById('amountGroup').style.display = (command === 'pay_and_create') ? 'block' : 'none';
  document.getElementById('storeTokenGroup').style.display = (command === 'pay_and_create') ? 'block' : 'none';
}

function submitForm() {
  alert('Gửi form token...');
  // Thực hiện logic gửi yêu cầu token ở đây
}
