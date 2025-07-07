
async function loadOrderStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('vnp_TxnRef') || urlParams.get('orderId');

  document.getElementById('orderId').innerText = orderId;

  const res = await fetch(`https://script.google.com/macros/s/AKfycbw9nAJs9S_-hr6KwZz9YgYCNmpbvogUwi_i8XPnUhiCrZ8xpniN_rOrt3uLSCDEVgCmgg/exec?action=getOrderStatus&orderId=${orderId}`);
  const data = await res.json();

  const statusText = data.status === "success" ? "Thành công ✅" :
                     data.status === "fail" ? "Thất bại ❌" :
                     "Không tìm thấy đơn";

  document.getElementById('status').innerText = statusText;
  document.getElementById('amount').innerText = data.amount.toLocaleString();
}

loadOrderStatus();
