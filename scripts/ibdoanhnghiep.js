async function handlePaymentIB() {
  const amount = calculateCartTotal();
  const orderId = Date.now();
  localStorage.setItem("lastOrderId", orderId);
  const orderInfo = cart.map((item) => `${item.id}_${item.quantity}`).join(",");

  // ✨ Build query string
  const query = `?action=ibdoanhnghiep&amount=${encodeURIComponent(amount)}&orderInfo=${encodeURIComponent(orderInfo)}`;

  try {
    const response = await fetch(`${BASE_URL}${query}`);
    const result = await response.json();
    console.log("✅ VNPAY init:", result);
    if (result.ispTxnId && result.dataKey && result.tmnCode) {
      // Đổ dữ liệu vào form hidden
      document.getElementById("ispTxnId").value = result.ispTxnId;
      document.getElementById("dataKey").value = result.dataKey;
      document.getElementById("tmnCode").value = result.tmnCode;
      // Tự động submit
      document.getElementById("payment_form").submit();
    } else {
      alert("Không đủ thông tin để thanh toán!");
      console.error(result);
    }
  } catch (err) {
    console.error("❌ Lỗi thanh toán:", err);
    alert("Lỗi xử lý thanh toán.");
  }
}
