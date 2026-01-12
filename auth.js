document.getElementById("a-login").addEventListener("click", async () => {
  const email = document.getElementById("a-email").value.trim();
  const password = document.getElementById("a-pass").value;
  if (!email || !password) return alert("email and password required");
  try {
    const json = await fetchJson(`http://${HOST}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    const token = json.data?.accessToken || json.accessToken || json.data?.token || json.token || "";
    document.getElementById("a-token").value = token;
    if (token) setToken(token);
  } catch (err) {
    alert("Login failed");
    console.error(err);
  }
});

document.getElementById("a-refresh").addEventListener("click", async () => {
  try {
    const json = await fetchJson(`http://${HOST}/api/auth/refresh`, { method: "POST" });
    const token = json.data?.token || json.token || "";
    if (token) {
      document.getElementById("a-token").value = token;
      alert("Token refreshed");
    } else {
      alert("No token returned");
    }
  } catch (err) {
    alert("Refresh failed");
    console.error(err);
  }
});

document.getElementById("a-logout").addEventListener("click", async () => {
  try {
    await fetchJson(`http://${HOST}/api/auth/logout`, { method: "POST" });
  } catch (err) {
    console.error(err);
  } finally {
    localStorage.removeItem("token");
    document.getElementById("a-token").value = "";
    alert("Logged out");
  }
});

document.getElementById("a-copy").addEventListener("click", () => {
  const t = document.getElementById("a-token");
  t.select();
  document.execCommand("copy");
});

document.getElementById("a-save").addEventListener("click", () => {
  const t = document.getElementById("a-token").value.trim();
  if (t) localStorage.setItem("token", t);
});

const meBtn = document.getElementById("a-me");
if (meBtn) {
  meBtn.addEventListener("click", async () => {
    const json = await fetchJson(`http://${HOST}/api/auth/me`);
    document.getElementById("me-info").textContent = JSON.stringify(json.data || json, null, 2);
  });
}