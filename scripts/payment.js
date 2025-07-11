// Gán event change cho radio button
document.querySelectorAll('input[name="payment-method"]').forEach((input) => {
  input.addEventListener("change", handleMethodChange);
});

function handleMethodChange() {
  const method = document.querySelector('input[name="payment-method"]:checked').value;
  document.getElementById("payment-button").style.display = "none";
  document.getElementById("payment-button-ib").style.display = "none";
  document.getElementById("token-form-section").style.display = "none";
  document.getElementById("deeplink-section").style.display = "none";
  document.getElementById("checkout-info").style.display = "block";
  if (method === "vnpay-payment") {
    document.getElementById("payment-button").style.display = "inline-block";
  } else if (method === "vnpay-token") {
    loadSavedTokens("User1");
    document.getElementById("token-form-section").style.display = "block";
  } else if (method === "vnpay-deeplink") {
    document.getElementById("deeplink-section").style.display = "block";
    renderBankList(); // Gọi từ bankDeeplink.js
  } else if (method === "vnpay-ib") {
    document.getElementById("payment-button-ib").style.display = "inline-block";
  }
}

function onCommandChange() {
  const command = document.getElementById("vnp_command").value;
  document.getElementById("storeTokenGroup").style.display = command === "pay_and_create" ? "block" : "none";
}

async function handlePayment() {
  // Cách 1 sử dữ liệu từ frontend về theo param querystring

  const customerInfo = {
    name: document.getElementById("customer-name").value.trim(),
    phone: document.getElementById("customer-phone").value.trim(),
    email: document.getElementById("customer-email").value.trim(),
    address: document.getElementById("customer-address").value.trim(),
  };
  if (!customerInfo.name || !customerInfo.phone || !customerInfo.email || !customerInfo.address) {
    alert("Vui lòng nhập đầy đủ thông tin khách hàng.");
    return;
  }
  const amount = calculateCartTotal();
  const orderId = Date.now();
  localStorage.setItem("lastOrderId", orderId);
  const orderInfo = cart.map((item) => `${item.id}_${item.quantity}`).join(",");

  const url = `${BASE_URL}?action=getPaymentUrl&amount=${amount}&orderId=${orderId}&orderInfo=${encodeURIComponent(
    orderInfo
  )}&customerName=${encodeURIComponent(customerInfo.name)}&customerPhone=${encodeURIComponent(
    customerInfo.phone
  )}&customerEmail=${encodeURIComponent(customerInfo.email)}&customerAddress=${encodeURIComponent(
    customerInfo.address
  )}`;

  const response = await fetch(url);
  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Có lỗi khi tạo link thanh toán");
  }
}

async function handlePaymentPost() {
  //Cách 2: Sử dụng  đẩy json từ frontend về Server. Hiện tại không sử dụng, viết để tham khảo
  const customerInfo = {
    name: document.getElementById("customer-name").value.trim(),
    phone: document.getElementById("customer-phone").value.trim(),
    email: document.getElementById("customer-email").value.trim(),
    address: document.getElementById("customer-address").value.trim(),
  };
  if (!customerInfo.name || !customerInfo.phone || !customerInfo.email || !customerInfo.address) {
    alert("Vui lòng nhập đầy đủ thông tin khách hàng.");
    return;
  }
  const amount = calculateCartTotal();
  const orderId = Date.now();
  localStorage.setItem("lastOrderId", orderId);
  const orderInfo = cart.map((item) => `${item.id}_${item.quantity}`).join(",");

  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "getPaymentUrlPost",
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email,
      customerAddress: customerInfo.address,
    }),
  });

  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Có lỗi khi tạo link thanh toán");
  }
}
