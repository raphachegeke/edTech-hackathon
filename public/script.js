// Base URL of your deployed API
const API_BASE = "https://ed-tech-hackathon.vercel.app/api";

// ---------------- SIGNUP ----------------
async function signup(event) {
  event.preventDefault();
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.error || "Signup failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
}

// ---------------- LOGIN ----------------
async function login(event) {
  event.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
}

// ---------------- VERIFY TOKEN ----------------
async function verifyToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });

    const data = await res.json();
    if (!res.ok || !data.valid) {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }
  } catch (err) {
    console.error("Token verification failed:", err);
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }
}

// ---------------- LOGOUT ----------------
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// ---------------- ATTACH EVENTS ----------------
document.addEventListener("DOMContentLoaded", () => {
  // Signup form
  const signupForm = document.getElementById("signup-form");
  if (signupForm) signupForm.addEventListener("submit", signup);

  // Login form
  const loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.addEventListener("submit", login);

  // Dashboard page
  if (window.location.pathname.endsWith("dashboard.html")) {
    verifyToken();
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
  }
});
