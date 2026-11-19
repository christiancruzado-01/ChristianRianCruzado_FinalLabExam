/* Urban Threads – catalog, cart, and form logic */
"use strict";

const IMG = "https://images.unsplash.com/";
const CART_KEY = "urbanThreadsCart";

const products = [
  { id: 1, name: "Essential Heavyweight Tee", category: "T-Shirts", price: 699, image: "photo-1521572163474-6864f9cf17ab", tag: "Bestseller", featured: true, description: "A 240 GSM cotton tee with a relaxed boxy fit and dropped shoulders. Your everyday staple." },
  { id: 2, name: "Midnight Graphic Tee", category: "T-Shirts", price: 799, image: "photo-1503342217505-b0a15ec3261c", tag: "New", featured: false, description: "Soft-washed black tee with a minimalist chest print inspired by Manila nights." },
  { id: 3, name: "Sand Oversized Tee", category: "T-Shirts", price: 499, image: "photo-1576566588028-4147f3842f27", tag: "", featured: false, description: "Lightweight oversized tee in a neutral sand tone. Breathable and easy to layer." },
  { id: 4, name: "Classic Pullover Hoodie", category: "Hoodies", price: 1499, image: "photo-1556821840-3a63f95609a7", tag: "Bestseller", featured: true, description: "400 GSM brushed fleece hoodie with a double-layer hood and kangaroo pocket." },
  { id: 5, name: "Stone Wash Hoodie", category: "Hoodies", price: 1699, image: "photo-1620799140408-edc6dcb6d633", tag: "", featured: false, description: "Garment-dyed hoodie with a vintage stone-washed finish. Every piece is slightly unique." },
  { id: 6, name: "Cloud Grey Zip Hoodie", category: "Hoodies", price: 1599, image: "photo-1618354691373-d851c5c3a990", tag: "", featured: false, description: "Full-zip hoodie in heather grey with ribbed cuffs and a metal YKK zipper." },
  { id: 7, name: "Straight Denim Jeans", category: "Pants", price: 1899, image: "photo-1542272604-787c3835535d", tag: "", featured: true, description: "Rigid 13 oz denim with a straight leg and mid rise. Breaks in beautifully over time." },
  { id: 8, name: "Utility Cargo Pants", category: "Pants", price: 1799, image: "photo-1624378439575-d8705ad7ae80", tag: "New", featured: false, description: "Relaxed cargo pants with six pockets, adjustable hems and a durable cotton twill." },
  { id: 9, name: "Relaxed Chino Trousers", category: "Pants", price: 1399, image: "photo-1473966968600-fa801b869a1a", tag: "", featured: false, description: "Clean chinos with a tapered leg. Dress them up or down." },
  { id: 10, name: "Leather Biker Jacket", category: "Jackets", price: 3999, image: "photo-1551028719-00167b16eac5", tag: "Premium", featured: true, description: "Faux-leather biker jacket with asymmetric zip, quilted lining and silver hardware." },
  { id: 11, name: "Olive Bomber Jacket", category: "Jackets", price: 2499, image: "photo-1591047139829-d91aecb6caea", tag: "", featured: false, description: "Water-resistant nylon bomber with ribbed trims and a utility sleeve pocket." },
  { id: 12, name: "Denim Trucker Jacket", category: "Jackets", price: 2299, image: "photo-1544441893-675973e31985", tag: "", featured: false, description: "Classic trucker jacket in medium wash denim with button-flap chest pockets." },
  { id: 13, name: "Street Logo Cap", category: "Accessories", price: 599, image: "photo-1588850561407-ed78c282e89b", tag: "", featured: false, description: "Six-panel cotton cap with an embroidered logo and adjustable strap." },
  { id: 14, name: "Everyday Canvas Backpack", category: "Accessories", price: 1299, image: "photo-1553062407-98eeb64c6a62", tag: "New", featured: false, description: "Durable canvas backpack with a padded laptop sleeve that fits up to 15 inches." }
];

const peso = (amount) => "₱" + amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const imageUrl = (id, width) => `${IMG}${id}?w=${width}&q=80`;
const findProduct = (id) => products.find((product) => product.id === id);
const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ===== Cart storage ===== */
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    return saved.filter((item) => findProduct(item.id) && item.quantity > 0);
  } catch {
    return [];
  }
}
let cart = loadCart();

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);
  if (existing) existing.quantity += 1;
  else cart.push({ id: productId, quantity: 1 });
  saveCart();
  showToast(`${findProduct(productId).name} added to cart`);
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
  });
}

function changeQuantity(productId, delta) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== productId);
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter((entry) => entry.id !== productId);
  saveCart();
}

function getCartTotals() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + findProduct(item.id).price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 2500 ? 0 : 150;
  return { itemCount, subtotal, shipping, total: subtotal + shipping };
}

function renderCart() {
  const { itemCount, subtotal, shipping, total } = getCartTotals();
  document.querySelectorAll("[data-cart-count]").forEach((badge) => (badge.textContent = itemCount));

  const itemsEl = document.getElementById("cartItems");
  const summaryEl = document.getElementById("cartSummary");
  if (!itemsEl || !summaryEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><i class="bi bi-bag-x"></i><p class="fw-bold mb-1">Your cart is empty</p><p class="small">Looks like you haven't added anything yet.</p></div>`;
    summaryEl.innerHTML = "";
    return;
  }

  itemsEl.innerHTML = cart.map((item) => {
    const product = findProduct(item.id);
    return `<div class="cart-item">
      <img src="${imageUrl(product.image, 160)}" alt="${escapeHtml(product.name)}">
      <div>
        <p class="cart-item-name">${escapeHtml(product.name)}</p>
        <div class="cart-item-price">${peso(product.price)} × ${item.quantity} = <strong>${peso(product.price * item.quantity)}</strong></div>
        <div class="qty">
          <button class="btn-sm-icon" data-action="decrease" data-id="${product.id}" aria-label="Decrease quantity of ${escapeHtml(product.name)}"><i class="bi bi-dash"></i></button>
          <span aria-label="Quantity">${item.quantity}</span>
          <button class="btn-sm-icon" data-action="increase" data-id="${product.id}" aria-label="Increase quantity of ${escapeHtml(product.name)}"><i class="bi bi-plus"></i></button>
        </div>
      </div>
      <button class="remove-btn" data-action="remove" data-id="${product.id}" aria-label="Remove ${escapeHtml(product.name)} from cart"><i class="bi bi-trash3"></i></button>
    </div>`;
  }).join("");

  summaryEl.innerHTML = `
    <div class="cart-row"><span>Subtotal (${itemCount} item${itemCount > 1 ? "s" : ""})</span><span>${peso(subtotal)}</span></div>
    <div class="cart-row"><span>Shipping</span><span>${shipping === 0 ? "Free" : peso(shipping)}</span></div>
    ${shipping > 0 ? `<p class="small text-muted mb-2">Add ${peso(2500 - subtotal)} more for free shipping.</p>` : ""}
    <div class="cart-row cart-total mt-2"><span>Total</span><span>${peso(total)}</span></div>
    <button class="btn btn-brand w-100 mt-3" data-action="checkout">Checkout</button>
    <button class="btn btn-link w-100 text-muted mt-1" data-action="clear">Clear cart</button>`;
}

/* ===== Product rendering ===== */
function productCardHtml(product) {
  return `<div class="col-6 col-md-4 col-lg-3">
    <article class="product-card">
      <div class="product-img">
        <img src="${imageUrl(product.image, 600)}" alt="${escapeHtml(product.name)}" loading="lazy">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
      </div>
      <div class="product-body">
        <span class="product-cat">${product.category}</span>
        <h3 class="product-name">${escapeHtml(product.name)}</h3>
        <div class="product-price">${peso(product.price)}</div>
        <div class="product-actions">
          <button class="btn btn-brand" data-action="add" data-id="${product.id}"><i class="bi bi-bag-plus"></i> Add</button>
          <button class="btn btn-outline-brand" data-action="details" data-id="${product.id}">Details</button>
        </div>
      </div>
    </article>
  </div>`;
}

function showProductDetails(productId) {
  const product = findProduct(productId);
  const sizes = product.category === "Accessories" ? ["One Size"] : product.category === "Pants" ? ["28", "30", "32", "34", "36"] : ["S", "M", "L", "XL", "XXL"];
  document.getElementById("productModalBody").innerHTML = `<div class="row g-0">
    <div class="col-md-6"><img class="modal-img" src="${imageUrl(product.image, 900)}" alt="${escapeHtml(product.name)}"></div>
    <div class="col-md-6"><div class="modal-info">
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      <span class="product-cat">${product.category}</span>
      <h2 id="productModalTitle">${escapeHtml(product.name)}</h2>
      <div class="product-price fs-4">${peso(product.price)}</div>
      <p class="text-muted">${escapeHtml(product.description)}</p>
      <strong class="small text-uppercase">Available sizes</strong>
      <div class="size-row">${sizes.map((size) => `<span>${size}</span>`).join("")}</div>
      <ul class="small text-muted ps-3 mb-4"><li>Free shipping over ₱2,500</li><li>14-day easy exchange</li></ul>
      <button class="btn btn-brand btn-lg w-100" data-action="add" data-id="${product.id}"><i class="bi bi-bag-plus"></i> Add to Cart</button>
    </div></div>
  </div>`;
  bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal")).show();
}

function showToast(message) {
  const toastEl = document.getElementById("cartToast");
  if (!toastEl) return;
  document.getElementById("cartToastText").textContent = message;
  bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2200 }).show();
}

/* ===== Shop page: search, filter, sort ===== */
function initShop() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const chips = document.querySelectorAll("#categoryFilters .chip");
  const emptyState = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");

  const validCategories = ["All", "T-Shirts", "Hoodies", "Pants", "Jackets", "Accessories"];
  const requested = new URLSearchParams(window.location.search).get("category");
  let activeCategory = validCategories.includes(requested) ? requested : "All";

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    let list = products.filter((product) =>
      (activeCategory === "All" || product.category === activeCategory) &&
      product.name.toLowerCase().includes(query));
    if (sortSelect.value === "low-high") list = [...list].sort((a, b) => a.price - b.price);
    if (sortSelect.value === "high-low") list = [...list].sort((a, b) => b.price - a.price);

    grid.innerHTML = list.map(productCardHtml).join("");
    emptyState.classList.toggle("d-none", list.length > 0);
    resultCount.textContent = `Showing ${list.length} of ${products.length} products`;
    chips.forEach((chip) => {
      const isActive = chip.dataset.category === activeCategory;
      chip.classList.toggle("active", isActive);
      chip.setAttribute("aria-pressed", isActive);
    });
  }

  chips.forEach((chip) => chip.addEventListener("click", () => { activeCategory = chip.dataset.category; render(); }));
  searchInput.addEventListener("input", render);
  sortSelect.addEventListener("change", render);
  render();
}

function initFeatured() {
  const grid = document.getElementById("featuredGrid");
  if (grid) grid.innerHTML = products.filter((product) => product.featured).map(productCardHtml).join("");
}

/* ===== Contact form validation ===== */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const alertBox = document.getElementById("formAlert");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const rules = {
    fullName: (value) => value.length >= 2,
    email: (value) => emailPattern.test(value),
    subject: (value) => value.length >= 2,
    message: (value) => value.length >= 10
  };

  function validateField(field) {
    const valid = rules[field.name](field.value.trim());
    field.classList.toggle("is-invalid", !valid);
    field.classList.toggle("is-valid", valid);
    field.setAttribute("aria-invalid", !valid);
    return valid;
  }

  Object.keys(rules).forEach((name) => {
    form.elements[name].addEventListener("input", (event) => {
      if (event.target.classList.contains("is-invalid") || event.target.classList.contains("is-valid")) validateField(event.target);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = Object.keys(rules).map((name) => form.elements[name]);
    const results = fields.map(validateField);
    alertBox.classList.remove("d-none", "alert-success", "alert-danger");

    if (results.includes(false)) {
      alertBox.classList.add("alert-danger");
      alertBox.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>Please fix the highlighted fields before sending.`;
      fields[results.indexOf(false)].focus();
      return;
    }

    const name = form.elements.fullName.value.trim().split(" ")[0];
    alertBox.classList.add("alert-success");
    alertBox.innerHTML = `<i class="bi bi-check-circle me-2"></i>Thanks, ${escapeHtml(name)}! Your message has been sent. We'll reply within 24 hours.`;
    form.reset();
    fields.forEach((field) => field.classList.remove("is-valid", "is-invalid"));
  });
}

/* ===== Global click handling ===== */
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const id = Number(button.dataset.id);
  switch (button.dataset.action) {
    case "add": addToCart(id); break;
    case "details": showProductDetails(id); break;
    case "increase": changeQuantity(id, 1); break;
    case "decrease": changeQuantity(id, -1); break;
    case "remove": removeFromCart(id); break;
    case "clear": cart = []; saveCart(); break;
    case "checkout":
      showToast("Thanks! Checkout is not available in this demo store.");
      break;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  initFeatured();
  initShop();
  initContactForm();
  renderCart();
});
