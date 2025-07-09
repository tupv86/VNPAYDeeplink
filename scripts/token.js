// token.js
async function requestToken(data) {
  const apiUrl = "https://script.google.com/macros/s/AKfycbw9nAJs9S_-hr6KwZz9YgYCNmpbvogUwi_i8XPnUhiCrZ8xpniN_rOrt3uLSCDEVgCmgg/exec";

  const payload = {
    action: "tokenRequest",
    data: data
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (result.url) {
    window.location.href = result.url; // ✅ Redirect ngay
  } else {
    alert("Có lỗi khi xử lý Token");
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

  const data = {
    vnp_command: formData.get('vnp_command'),
    vnp_app_user_id: formData.get('vnp_app_user_id'),
    vnp_txn_ref: Date.now(), // Tạo mã giao dịch duy nhất
    vnp_txn_desc: formData.get('vnp_txn_desc'),
    vnp_card_type: formData.get('vnp_card_type'),
    vnp_amount: formData.get('vnp_amount'),
    vnp_store_token: formData.get('vnp_store_token')
  };

  console.log("📌 Data gửi:", data);

  // 2️⃣ Gửi POST sang GAS
  requestToken(data);
}

