function showTokenTab(tab) {
  // Tab Buttons
  const tabs = document.querySelectorAll(".token-tab");
  tabs.forEach((t) => t.classList.remove("active"));

  // Tab Contents
  const createTab = document.getElementById("token-create-tab");
  const payTab = document.getElementById("token-pay-tab");

  if (tab === "create") {
    createTab.style.display = "block";
    payTab.style.display = "none";
    tabs[0].classList.add("active");
  } else {
    createTab.style.display = "none";
    payTab.style.display = "block";
    tabs[1].classList.add("active");
  }
}

async function requestToken(data) {
  // Build query string từ object data
  const params = new URLSearchParams();
  params.append("action", "tokenRequest");

  for (const key in data) {
    if (data[key]) {
      params.append(key, data[key]);
    }
  }

  const apiUrl = `${BASE_URL}?${params.toString()}`;

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

function submitForm() {
  // 1️⃣ Lấy dữ liệu form
  const form = document.getElementById("tokenForm");
  const formData = new FormData(form);
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
  const data = {
    vnp_command: formData.get("vnp_command"),
    vnp_app_user_id: formData.get("vnp_app_user_id"),
    vnp_txn_ref: orderId, // Tạo mã giao dịch duy nhất
    vnp_txn_desc: orderInfo,
    vnp_card_type: formData.get("vnp_card_type"),
    vnp_amount: amount,
    vnp_store_token: formData.get("vnp_store_token"),
    name: customerInfo.name,
    phone: customerInfo.phone,
    email: customerInfo.email,
    address: customerInfo.address,
  };

  console.log("📌 Data gửi:", data);

  // 2️⃣ Gửi POST sang GAS
  requestToken(data);
}

async function loadSavedTokens(userId) {
  try {
    const res = await fetch(`${BASE_URL}?action=getTokens&userId=${userId}`);
    const data = await res.json();
    console.log("✅ Tokens:", data);

    const select = document.getElementById("saved-tokens");
    select.innerHTML = "";

    if (data.tokens.length === 0) {
      const option = document.createElement("option");
      option.textContent = "Chưa có Token nào";
      select.appendChild(option);
    } else {
      data.tokens.forEach((t) => {
        const option = document.createElement("option");
        option.value = t.token;
        option.textContent = `${t.card} | Token: ${t.token}`;
        select.appendChild(option);
      });
    }
  } catch (err) {
    console.error("❌ Lỗi tải Token:", err);
    alert("Không tải được danh sách Token.");
  }
}

async function handleTokenPay() {
  const token = document.getElementById("saved-tokens").value;
  const userId = "User1"; // Hoặc lấy từ input
  const amount = calculateCartTotal(); // Tính giỏ hàng
  const txnRef = Date.now();
  localStorage.setItem("lastOrderId", orderId);
  const txnDesc = cart.map((item) => `${item.id}_${item.quantity}`).join(",");

  // Gọi sang Google Apps Script:
  const url =
    `${BASE_URL}?action=tokenPay` +
    `&vnp_token=${encodeURIComponent(token)}` +
    `&vnp_app_user_id=${encodeURIComponent(userId)}` +
    `&vnp_txn_ref=${txnRef}` +
    `&vnp_txn_desc=${encodeURIComponent(txnDesc)}` +
    `&vnp_amount=${amount}`;

  const res = await fetch(url);
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url; // Redirect VNPAY
  } else {
    alert("Lỗi tạo link thanh toán bằng Token");
  }
}
