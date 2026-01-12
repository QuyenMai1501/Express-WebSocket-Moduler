function baseUrl(path) { return `http://${HOST}/api/users${path || ""}`; }

async function loadUsers() {
  try {
    const json = await fetchJson(baseUrl("/"));
    const list = document.getElementById("u-list");
    list.innerHTML = "";
    for (const u of json.data || []) {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${u.email}</strong> - ${u.role || "-"} (id: ${u.id})
        <span class="actions">
          <button data-action="view" data-id="${u.id}">View</button>
          <button data-action="edit" data-id="${u.id}">Edit</button>
          <button data-action="delete" data-id="${u.id}">Delete</button>
        </span>`;
      list.appendChild(li);
    }
  } catch (err) {
    alert("Failed to load users");
    console.error(err);
  }
}

async function registerUser() {
  const email = document.getElementById("r-email").value.trim();
  const password = document.getElementById("r-password").value;
  const role = document.getElementById("r-role").value;
  if (!email || !password) return alert("Email and password required");
  try {
    await fetchJson(baseUrl("/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    document.getElementById("r-email").value = "";
    document.getElementById("r-password").value = "";
    loadUsers();
    alert("Registered");
  } catch (err) {
    alert("Register failed");
    console.error(err);
  }
}

async function getByEmail(email) {
  if (!email) return alert("Email required");
  try {
    const json = await fetchJson(baseUrl(`/by-email/${encodeURIComponent(email)}`));
    const u = json.data || json;
    if (!u) return alert("Not found");
    fillDetail(u);
  } catch (err) {
    alert("Get by email failed");
    console.error(err);
  }
}

async function getById(id) {
  if (!id) return alert("ID required");
  try {
    const json = await fetchJson(baseUrl(`/${id}`));
    const u = json.data || json;
    if (!u) return alert("Not found or auth required");
    fillDetail(u);
  } catch (err) {
    alert("Get by id failed (maybe auth required)");
    console.error(err);
  }
}

function fillDetail(u) {
  document.getElementById("d-id").value = u.id || "";
  document.getElementById("d-email").value = u.email || "";
  document.getElementById("d-role").value = u.role || "customer";
  document.getElementById("d-password").value = "";
  document.getElementById("s-id").value = u.id || "";
}

function clearDetail() {
  document.getElementById("d-id").value = "";
  document.getElementById("d-email").value = "";
  document.getElementById("d-role").value = "customer";
  document.getElementById("d-password").value = "";
  document.getElementById("s-id").value = "";
  document.getElementById("s-email").value = "";
}

async function putDetail() {
  const id = document.getElementById("d-id").value;
  if (!id) return alert("No ID selected");
  const email = document.getElementById("d-email").value.trim();
  const role = document.getElementById("d-role").value;
  const password = document.getElementById("d-password").value;
  try {
    await fetchJson(baseUrl(`/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    alert("Saved (PUT)");
    loadUsers();
  } catch (err) {
    alert("PUT failed (maybe auth required)");
    console.error(err);
  }
}

async function patchDetail() {
  const id = document.getElementById("d-id").value;
  if (!id) return alert("No ID selected");
  const payload = {};
  const email = document.getElementById("d-email").value.trim();
  const role = document.getElementById("d-role").value;
  const password = document.getElementById("d-password").value;
  if (email) payload.email = email;
  if (role) payload.role = role;
  if (password) payload.password = password;
  if (Object.keys(payload).length === 0) return alert("Nothing to patch");
  try {
    await fetchJson(baseUrl(`/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    alert("Patched");
    loadUsers();
  } catch (err) {
    alert("PATCH failed (maybe auth required)");
    console.error(err);
  }
}

async function deleteDetail() {
  const id = document.getElementById("d-id").value;
  if (!id) return alert("No ID selected");
  if (!confirm("Delete user?")) return;
  try {
    await fetchJson(baseUrl(`/${id}`), { method: "DELETE" });
    alert("Deleted");
    clearDetail();
    loadUsers();
  } catch (err) {
    alert("Delete failed (maybe auth required)");
    console.error(err);
  }
}

document.getElementById("r-register").addEventListener("click", registerUser);
document.getElementById("s-getByEmail").addEventListener("click", () => getByEmail(document.getElementById("s-email").value.trim()));
document.getElementById("s-getById").addEventListener("click", () => getById(document.getElementById("s-id").value.trim()));
document.getElementById("s-refresh").addEventListener("click", loadUsers);

document.getElementById("u-list").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  if (action === "view") getById(id);
  if (action === "edit") getById(id);
  if (action === "delete") {
    if (!confirm("Delete user?")) return;
    fetchJson(baseUrl(`/${id}`), { method: "DELETE" }).then(loadUsers).catch(err => { alert("Delete failed"); console.error(err);});
  }
});

document.getElementById("d-put").addEventListener("click", putDetail);
document.getElementById("d-patch").addEventListener("click", patchDetail);
document.getElementById("d-delete").addEventListener("click", deleteDetail);
document.getElementById("d-clear").addEventListener("click", clearDetail);

loadUsers();