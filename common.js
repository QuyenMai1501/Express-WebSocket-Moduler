// lightweight shared helpers
const HOST = "localhost:9999";
function getToken() { return localStorage.getItem("token") || ""; }
function setToken(t) { if (t) localStorage.setItem("token", t); }
function authHeaders() { const t = getToken(); return t ? { Authorization: `Bearer ${t}` } : {}; }
async function fetchJson(url, opts = {}) {
  opts.headers = { ...(opts.headers || {}), ...authHeaders() };
  // ensure cookies are sent/accepted for refresh/logout and set-cookie on login
  opts.credentials = opts.credentials || "include";
  const res = await fetch(url, opts);
  return res.json();
}