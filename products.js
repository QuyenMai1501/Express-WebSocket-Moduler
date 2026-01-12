function authHeaders() {
  const t = localStorage.getItem("token") || "";
  return t ? { Authorization: `Bearer ${t}` } : {};
}
async function fetchJson(url, opts = {}) {
  opts.headers = { ...(opts.headers || {}), ...authHeaders() };
  const res = await fetch(url, opts);
  return res.json();
}

function baseUrl(path) { return `http://${HOST}/api/products${path || ""}`; }

function normalizeId(obj) {
  if (!obj) return "";
  return obj.id || (obj._id && (typeof obj._id === "string" ? obj._id : (obj._id.toString ? obj._id.toString() : ""))) || "";
}

async function loadProducts() {
  try {
    const json = await fetchJson(baseUrl("/"));
    const list = document.getElementById("p-list");
    list.innerHTML = "";

    const items = Array.isArray(json.data) ? json.data : (json.data?.items || []);

    for (const p of items) {
      const id = normalizeId(p);
      const li = document.createElement("li");
      li.innerHTML = `<strong>${p.title}</strong> — ${p.price ?? "-"} ${p.currency || ""} (id: ${id})
        <span class="actions">
          <button data-action="view" data-id="${id}">View</button>
          <button data-action="edit" data-id="${id}">Edit</button>
          <button data-action="delete" data-id="${id}">Delete</button>
        </span>`;
      list.appendChild(li);
    }
  } catch (err) {
    alert("Failed to load products");
    console.error(err);
  }
}

async function createProduct() {
  const sku = document.getElementById("p-sku").value.trim();
  const title = document.getElementById("p-title").value.trim();
  const description = document.getElementById("p-desc").value.trim();
  const price = parseFloat(document.getElementById("p-price").value) || 0;
  const currency = document.getElementById("p-currency").value;
  const category = document.getElementById("p-category").value.trim();
  const tags = document.getElementById("p-tags").value.split(",").map(t=>t.trim()).filter(Boolean);

  if (!sku) return alert("sku required");
  if (!title) return alert("title required");

  try {
    await fetchJson(baseUrl("/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, title, description, price, currency, category, tags }),
    });
    document.getElementById("p-sku").value = "";
    document.getElementById("p-title").value = "";
    document.getElementById("p-desc").value = "";
    document.getElementById("p-price").value = "";
    document.getElementById("p-category").value = "";
    document.getElementById("p-tags").value = "";
    loadProducts();
  } catch (err) {
    alert("Create failed (admin required)");
    console.error(err);
  }
}

async function getById(id) {
  if (!id) return alert("ID required");
  try {
    const json = await fetchJson(baseUrl(`/${id}`));
    const p = json.data || json;
    if (!p) return alert("Not found");
    fillDetail(p);
  } catch (err) {
    alert("Get by id failed (maybe auth required)");
    console.error(err);
  }
}

function fillDetail(p) {
  document.getElementById("d-id").value = normalizeId(p);
  document.getElementById("d-sku").value = p.sku || "";
  document.getElementById("d-title").value = p.title || "";
  document.getElementById("d-desc").value = p.description || "";
  document.getElementById("d-price").value = p.price ?? "";
  document.getElementById("d-currency").value = p.currency || "USD";
  document.getElementById("d-category").value = p.category || "";
  document.getElementById("d-tags").value = (p.tags || []).join(", ");
}

function clearDetail() {
  document.getElementById("d-id").value = "";
  document.getElementById("d-sku").value = "";
  document.getElementById("d-title").value = "";
  document.getElementById("d-desc").value = "";
  document.getElementById("d-price").value = "";
  document.getElementById("d-currency").value = "USD";
  document.getElementById("d-category").value = "";
  document.getElementById("d-tags").value = "";
}

async function patchDetail() {
  const id = document.getElementById("d-id").value;
  if (!id) return alert("No ID selected");
  const payload = {};
  const sku = document.getElementById("d-sku").value.trim();
  const title = document.getElementById("d-title").value.trim();
  const description = document.getElementById("d-desc").value.trim();
  const priceRaw = document.getElementById("d-price").value;
  const currency = document.getElementById("d-currency").value;
  const category = document.getElementById("d-category").value.trim();
  const tags = document.getElementById("d-tags").value.split(",").map(t=>t.trim()).filter(Boolean);

  if (sku) payload.sku = sku;
  if (title) payload.title = title;
  if (description) payload.description = description;
  if (priceRaw !== "") payload.price = parseFloat(priceRaw) || 0;
  if (currency) payload.currency = currency;
  if (category) payload.category = category;
  if (tags.length) payload.tags = tags;

  if (Object.keys(payload).length === 0) return alert("Nothing to patch");

  try {
    await fetchJson(baseUrl(`/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    alert("Patched");
    loadProducts();
  } catch (err) {
    alert("PATCH failed (maybe auth/admin required)");
    console.error(err);
  }
}

async function deleteDetail() {
  const id = document.getElementById("d-id").value;
  if (!id) return alert("No ID selected");
  if (!confirm("Delete product?")) return;
  try {
    await fetchJson(baseUrl(`/${id}`), { method: "DELETE" });
    alert("Deleted");
    clearDetail();
    loadProducts();
  } catch (err) {
    alert("Delete failed (maybe auth/admin required)");
    console.error(err);
  }
}

document.getElementById("p-create").addEventListener("click", createProduct);
document.getElementById("p-refresh").addEventListener("click", loadProducts);

document.getElementById("p-list").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  if (action === "view" || action === "edit") getById(id);
  if (action === "delete") {
    if (!confirm("Delete product?")) return;
    fetchJson(baseUrl(`/${id}`), { method: "DELETE" }).then(loadProducts).catch(err => { alert("Delete failed"); console.error(err);});
  }
});

document.getElementById("d-patch").addEventListener("click", patchDetail);
document.getElementById("d-delete").addEventListener("click", deleteDetail);
document.getElementById("d-clear").addEventListener("click", clearDetail);

loadProducts();