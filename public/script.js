// Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password })
    });
    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) window.location.href = "verify.html";
  });
}

// Verify
const verifyForm = document.getElementById("verifyForm");
if (verifyForm) {
  verifyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = document.getElementById("phone").value;
    const code = document.getElementById("code").value;

    const res = await fetch("/api/verifyCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code })
    });
    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    }
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = document.getElementById("phone").value;
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
    window.location.href = "index.html";
  });
}
