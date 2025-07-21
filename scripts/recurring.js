async function handlePaymentRecurring() {
  const recurringAmount = calculateCartTotal();
  const orderId = Date.now();
  localStorage.setItem("lastOrderId", orderId);
  const orderInfo = cart.map((item) => `${item.id}_${item.quantity}`).join(",");
  // ✨ Build query string
  const recurringFrequency = "month";
  const recurringFrequencyNumber = 3;
  const ipAddr = "127.0.0.1";

  const query =
    `?action=getinitrecurring` +
    `&orderReference=${encodeURIComponent(orderId)}` +
    `&command=recurring` +
    `&recurringAmount=${encodeURIComponent(recurringAmount)}` +
    `&recurringFrequency=${encodeURIComponent(recurringFrequency)}` +
    `&recurringFrequencyNumber=${encodeURIComponent(recurringFrequencyNumber)}` +
    `&language=vn` +
    `&ipAddr=${encodeURIComponent(ipAddr)}`;
  try {
    const response = await fetch(`${BASE_URL}${query}`);
    const result = await response.json();
    const lastLog = localStorage.getItem("result");
    console.log("Lần cuối gọi Recurring:", JSON.parse(lastLog));
    console.log("✅ VNPAY init:", result);
    if (result.ispTxnId && result.dataKey && result.tmnCode) {
      // Đổ dữ liệu vào form hidden
      document.getElementById("ispTxnIdRec").value = result.ispTxnId;
      document.getElementById("dataKeyRec").value = result.dataKey;
      document.getElementById("tmnCodeRec").value = result.tmnCode;
      // Tự động submit
      document.getElementById("payment_form_recurring").submit();
    } else {
      alert("Không đủ thông tin để thanh toán!");
      console.error(result);
    }
  } catch (err) {
    console.error("❌ Lỗi thanh toán:", err);
    alert("Lỗi xử lý thanh toán.");
  }
}
