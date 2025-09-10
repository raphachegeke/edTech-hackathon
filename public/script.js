// Format Kenyan phone number to +254 format
function formatPhone(phone) {
  phone = phone.trim();
  if (phone.startsWith("0")) {
    return "+254" + phone.slice(1);
  }
  return phone;
}

// Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = formatPhone(document.getElementById("phone").value);
    const password = document.getElementById("password").value;

    document.getElementById("signupLoading").classList.remove("d-none");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password })
    });

    document.getElementById("signupLoading").classList.add("d-none");
    const data = await res.json();
    alert(data.message || data.error);

    if (res.ok) {
      localStorage.setItem("phone", phone); // Save for verify page
      window.location.href = "verify.html";
    }
  });
}

// Verify
const verifyForm = document.getElementById("verifyForm");
if (verifyForm) {
  verifyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = formatPhone(document.getElementById("verifyPhone").value);
    const code = document.getElementById("code").value;

    document.getElementById("verifyLoading").classList.remove("d-none");

    const res = await fetch("/api/verifyCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code })
    });

    document.getElementById("verifyLoading").classList.add("d-none");
    const data = await res.json();
    alert(data.message || data.error);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    }
  });

  // Auto-fill phone if saved
  const savedPhone = localStorage.getItem("phone");
  if (savedPhone) document.getElementById("verifyPhone").value = savedPhone;

  // Resend code
  document.getElementById("resendBtn").addEventListener("click", async () => {
    const phone = formatPhone(document.getElementById("verifyPhone").value);
    const password = "temp"; // dummy password required for signup API

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password })
    });

    const data = await res.json();
    alert(data.message || data.error);
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = formatPhone(document.getElementById("phone").value);
    const password = document.getElementById("password").value;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password })
    });

    const data = await res.json();
    alert(data.message || data.error);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phone");
    window.location.href = "index.html";
  });
}
