async function handlePaymentISP() {
  const amount = calculateCartTotal();
  const orderId = Date.now();
  localStorage.setItem("lastOrderId", orderId);
  const orderInfo = cart.map((item) => `${item.id}_${item.quantity}`).join(",");
  // ✨ Build query string
  const query = `?action=isp&amount=${encodeURIComponent(amount)}&orderId=${orderId}&orderInfo=${encodeURIComponent(
    orderInfo
  )}`;

  try {
    const response = await fetch(`${BASE_URL}${query}`);
    const result = await response.json();
    const lastLog = localStorage.getItem("result");
    console.log("Lần cuối gọi ISP:", JSON.parse(lastLog));
    console.log("✅ VNPAY init:", result);
    if (result.ispTxnId && result.dataKey && result.tmnCode) {
      // Đổ dữ liệu vào form hidden
      document.getElementById("ispTxnIdIsp").value = result.ispTxnId;
      document.getElementById("dataKeyIsp").value = result.dataKey;
      document.getElementById("tmnCodeIsp").value = result.tmnCode;
      // Tự động submit
      document.getElementById("payment_form_isp").submit();
    } else {
      alert("Không đủ thông tin để thanh toán!");
      console.error(result);
    }
  } catch (err) {
    console.error("❌ Lỗi thanh toán:", err);
    alert("Lỗi xử lý thanh toán.");
  }
}
