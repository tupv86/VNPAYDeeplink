let bankData = [];
const orderId = Date.now();
localStorage.setItem('lastOrderId', orderId);

async function renderBankList() {
  const res = await fetch("/data/bankData.json");
  bankData = await res.json();

  const bankGrid = document.getElementById("bankGrid");
  bankGrid.innerHTML = "";

  bankData.forEach((bank) => {
    const bankItem = document.createElement("div");
    bankItem.className = "bank-item";

    const logo = document.createElement("img");
    logo.src = bank.logo_link;
    logo.alt = `${bank.app_name} logo`;
    logo.className = "bank-logo";

    logo.addEventListener("click", () => {
      openBankApp(bank);
    });

    const appName = document.createElement("p");
    appName.textContent = bank.app_name;

    bankItem.appendChild(logo);
    bankItem.appendChild(appName);
    bankGrid.appendChild(bankItem);
  });
}

async function openBankApp(bank) {

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
  const orderInfo = cart.map(item => `${item.id}_${item.quantity}`).join(',');
  console.log("Bank object:", bank);

  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbw9nAJs9S_-hr6KwZz9YgYCNmpbvogUwi_i8XPnUhiCrZ8xpniN_rOrt3uLSCDEVgCmgg/exec?action=getqr&amount=${amount}&orderId=${orderId}&orderInfo=${encodeURIComponent(orderInfo)}&customerName=${encodeURIComponent(customerInfo.name)}&customerPhone=${encodeURIComponent(customerInfo.phone)}&customerEmail=${encodeURIComponent(customerInfo.email)}&customerAddress=${encodeURIComponent(customerInfo.address)}`
    );
    const data = await response.json();

    console.log("QR Content:", data.qrcontent);

    lastBank = bank;
    lastQrContent = data.qrcontent;
    doRedirect();
   /* document.getElementById("debugBox").innerHTML = `
      <button onclick="doRedirect()">Mở App</button>
    `;*/
  } catch (error) {
    console.error("Lỗi gọi API:", error);
    alert("Có lỗi khi lấy QR: " + error.message);
  }
}

function doRedirect() {
  const bank = lastBank;
  const qrContent = lastQrContent;
  const redirect_client_url_value = "https://resonant-paprenjak-dab66f.netlify.app/return";
  const callbackUrl = `${redirect_client_url_value}?orderId=${orderId}`;
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const appScheme = isIOS ? bank.ios_scheme : bank.andr_scheme;
  const appLink = isIOS ? bank.ios_app_link : bank.andr_app_link;
  const appPackage = bank.andr_packid;

  if (bank.deeplink_support === "1" && appScheme !== "#") {
    let deeplink = "";
    if (isIOS) {
      deeplink = `${appScheme}://${encodeURIComponent(
        qrContent
      )}?callbackurl=${encodeURIComponent(callbackUrl)}`;
    } else {
      deeplink = `intent://view?data=${encodeURIComponent(
        qrContent
      )}&callbackurl=${encodeURIComponent(
        callbackUrl
      )}#Intent;scheme=${appScheme};package=${appPackage};end`;
    }

    console.log("Open deeplink:", deeplink);
    window.location.href = deeplink;
  } else {
    window.open(appLink, "_blank");
  }
}
