async function loadOrderStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("vnp_txn_ref") || urlParams.get("vnp_TxnRef") || urlParams.get("orderId");

  if (!orderId) {
    document.getElementById("status").innerText = "Không tìm thấy mã đơn.";
    return;
  }

  // Hiển thị orderId
  document.getElementById("orderId").innerText = orderId;

  // Gọi API lấy trạng thái đơn
  const res = await fetch(`${BASE_URL}?action=getOrderStatus&orderId=${orderId}`);
  const data = await res.json();

  // Gán dữ liệu
  document.getElementById("orderInfo").innerText = data.orderInfo || "";
  document.getElementById("amount").innerText = data.amount.toLocaleString();
  document.getElementById("createDate").innerText = data.createDate || "";

  let statusText = "Không xác định";
  if (data.status === "success") {
    statusText = "Thành công ✅";
    // ✅ XÓA GIỎ HÀNG LUÔN
    localStorage.removeItem("cart");
  } else if (data.status === "fail") {
    statusText = "Thất bại ❌";
  } else {
    statusText = "Không tìm thấy đơn";
  }

  document.getElementById("status").innerText = statusText;
}

loadOrderStatus();
