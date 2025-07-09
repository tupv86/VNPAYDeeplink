async function requestToken(data) {
  // Build query string từ object data
  const params = new URLSearchParams();
  params.append("action", "tokenRequest");

  for (const key in data) {
    if (data[key]) {
      params.append(key, data[key]);
    }
  }

  const apiUrl = `https://script.google.com/macros/s/AKfycbw9nAJs9S_-hr6KwZz9YgYCNmpbvogUwi_i8XPnUhiCrZ8xpniN_rOrt3uLSCDEVgCmgg/exec?${params.toString()}`;

  console.log("📌 API URL:", apiUrl);

  const response = await fetch(apiUrl);
  const result = await response.json();

  if (result.url) {
    window.location.href = result.url; // ✅ Redirect luôn
  } else {
    alert("Có lỗi khi xử lý Token");
    console.log(result);
  }
}


function onCommandChange() {
  const command = document.getElementById('vnp_command').value;
  document.getElementById('amountGroup').style.display = (command === 'pay_and_create') ? 'block' : 'none';
  document.getElementById('storeTokenGroup').style.display = (command === 'pay_and_create') ? 'block' : 'none';
}

function submitForm() {
  // 1️⃣ Lấy dữ liệu form
  const form = document.getElementById('tokenForm');
  const formData = new FormData(form);
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
  const data = {
    vnp_command: formData.get('vnp_command'),
    vnp_app_user_id: formData.get('vnp_app_user_id'),
    vnp_txn_ref: orderId, // Tạo mã giao dịch duy nhất
    vnp_txn_desc:orderInfo,
    vnp_card_type: formData.get('vnp_card_type'),
    vnp_amount: amount,
    vnp_store_token: formData.get('vnp_store_token'),
    name: customerInfo.name,
    phone: customerInfo.phone,
    email: customerInfo.email,
    address: customerInfo.address
  };

  console.log("📌 Data gửi:", data);

  // 2️⃣ Gửi POST sang GAS
  requestToken(data);
}

