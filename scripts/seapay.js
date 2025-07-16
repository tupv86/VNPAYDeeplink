function handlePaymentSeapay() {
  const amount = calculateCartTotal();
  const orderId = Date.now();
  localStorage.setItem("lastOrderId", orderId);
  localStorage.setItem("lastOrderAmount", amount);

  // Gọi API GAS dùng GET
  const url = `${BASE_URL}?action=createOrderSeapay&orderId=${orderId}&amount=${amount}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("Đã lưu đơn:", data);
      // Tiếp tục chuyển hướng
      window.location.href = "seapay.html";
    });
}
