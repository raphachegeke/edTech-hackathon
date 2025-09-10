// Format phone to +254
function formatPhone(phone) {
  if (phone.startsWith("0")) {
    return "+254" + phone.slice(1);
  }
  return phone;
}

// Signup
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = formatPhone(document.getElementById("phone").value);
  const password = document.getElementById("password").value;

  document.getElementById("loading").style.display = "block";

  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password })
  });

  const data = await res.json();
  document.getElementById("loading").style.display = "none";
  document.getElementById("message").innerText = data.message || data.error;

  if (res.ok) {
    localStorage.setItem("phone", phone);
    window.location.href = "verify.html";
  }
});

// Verify
document.getElementById("verifyForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = localStorage.getItem("phone");
  const code = document.getElementById("code").value;

  document.getElementById("loading").style.display = "block";

  const res = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code })
  });

  const data = await res.json();
  document.getElementById("loading").style.display = "none";
  document.getElementById("message").innerText = data.message || data.error;

  if (res.ok) {
    window.location.href = "index.html";
  }
});

// Resend Code
document.getElementById("resendBtn")?.addEventListener("click", async () => {
  const phone = localStorage.getItem("phone");
  document.getElementById("loading").style.display = "block";

  const res = await fetch("/api/verifyCode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });

  const data = await res.json();
  document.getElementById("loading").style.display = "none";
  document.getElementById("message").innerText = data.message || data.error;
});

// Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = formatPhone(document.getElementById("loginPhone").value);
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password })
  });

  const data = await res.json();
  document.getElementById("loginMessage").innerText = data.message || data.error;

  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  }
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

// Forgot Password
document.getElementById("forgotForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = formatPhone(document.getElementById("forgotPhone").value);

  document.getElementById("loading").style.display = "block";

  const res = await fetch("/api/forgot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });

  const data = await res.json();
  document.getElementById("loading").style.display = "none";
  document.getElementById("forgotMessage").innerText = data.message || data.error;

  if (res.ok) {
    localStorage.setItem("resetPhone", phone);
    window.location.href = "reset";
  }
});

// Reset Password
document.getElementById("resetForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = localStorage.getItem("resetPhone");
  const code = document.getElementById("resetCode").value;
  const newPassword = document.getElementById("newPassword").value;

  document.getElementById("loading").style.display = "block";

  const res = await fetch("/api/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code, newPassword })
  });

  const data = await res.json();
  document.getElementById("loading").style.display = "none";
  document.getElementById("resetMessage").innerText = data.message || data.error;

  if (res.ok) {
    window.location.href = "login";
  }
});
