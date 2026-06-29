/* ==========================================================================
   LUXECART STOREFRONT - JAVASCRIPT LOGIC
   Clean, beginner-friendly vanilla JS for API fetching, dynamic filtering & cart
   ========================================================================== */

// Global State Variables
let products = [];
let categories = [];
let cart = [];
let activeCategory = 'all';
let maxPriceFilter = 1000;
let searchQuery = '';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const categoriesContainer = document.getElementById('categories-container');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const priceRange = document.getElementById('price-range');
const priceDisplay = document.getElementById('price-display');
const resultsCount = document.getElementById('results-count');

const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.getElementById('cart-drawer-overlay');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartBadge = document.getElementById('cart-badge');
const cartCountTitle = document.getElementById('cart-count-title');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const toastContainer = document.getElementById('toast-container');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadSavedCart();
  renderSkeletonLoaders();
  fetchStoreData();
  setupEventListeners();
});

// Load cart items from localStorage
function loadSavedCart() {
  const savedCart = localStorage.getItem('luxe_cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  }
  updateCartUI();
}

// Save cart items to localStorage
function saveCart() {
  localStorage.setItem('luxe_cart', JSON.stringify(cart));
  updateCartUI();
}

// Fetch products and categories concurrently from API
async function fetchStoreData() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch('https://fakestoreapi.com/products'),
      fetch('https://fakestoreapi.com/products/categories')
    ]);

    if (!productsRes.ok || !categoriesRes.ok) {
      throw new Error('Failed to fetch data from server.');
    }

    products = await productsRes.json();
    categories = await categoriesRes.json();

    // Calculate maximum price from products data
    if (products.length > 0) {
      const highest = Math.ceil(Math.max(...products.map(p => p.price)));
      maxPriceFilter = highest;
      priceRange.max = highest;
      priceRange.value = highest;
      priceDisplay.textContent = `$${highest}`;
    }

    renderCategories();
    applyFiltersAndRender();
  } catch (error) {
    console.error(error);
    productsGrid.innerHTML = `
      <div class="no-products-container">
        <div class="no-products-title">Unable to Load Products</div>
        <div class="no-products-text">Please check your network connection and try again later.</div>
      </div>
    `;
    resultsCount.textContent = '0 items found';
  }
}

// Render Skeleton Loading Placeholders
function renderSkeletonLoaders() {
  let skeletonsHTML = '';
  for (let i = 0; i < 8; i++) {
    skeletonsHTML += `
      <div class="skeleton-card">
        <div class="skeleton-box" style="height: 180px;"></div>
        <div class="skeleton-box" style="height: 20px; width: 40%;"></div>
        <div class="skeleton-box" style="height: 40px; width: 90%;"></div>
        <div class="skeleton-box" style="height: 30px; width: 50%; margin-top: auto;"></div>
      </div>
    `;
  }
  productsGrid.innerHTML = skeletonsHTML;
}

// Render Category Filter Buttons dynamically
function renderCategories() {
  let html = `<button class="category-pill active" data-category="all">All Items</button>`;
  categories.forEach(cat => {
    html += `<button class="category-pill" data-category="${cat}">${cat}</button>`;
  });
  categoriesContainer.innerHTML = html;

  // Add click handlers to new buttons
  const categoryPills = categoriesContainer.querySelectorAll('.category-pill');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      categoryPills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.getAttribute('data-category');
      applyFiltersAndRender();
    });
  });
}

// Apply Combined Filters (Search + Category + Price)
function applyFiltersAndRender() {
  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesPrice = p.price <= maxPriceFilter;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  resultsCount.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`;
  renderProductCards(filtered);
}

// Render Product Cards to Grid
function renderProductCards(items) {
  if (items.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-products-container">
        <div class="no-products-title">No matching products found</div>
        <div class="no-products-text">Try adjusting your search terms or filters to discover items.</div>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = items.map(product => {
    // Generate star ratings
    const ratingStars = '★'.repeat(Math.round(product.rating.rate)) + '☆'.repeat(5 - Math.round(product.rating.rate));
    
    return `
      <div class="product-card">
        <div class="product-image-container">
          <span class="product-category-badge">${product.category}</span>
          <img src="${product.image}" alt="${escapeHtml(product.title)}" class="product-image" loading="lazy">
        </div>
        <div class="product-info">
          <div class="product-rating">
            <span class="rating-stars">${ratingStars}</span>
            <span>(${product.rating.count})</span>
          </div>
          <h3 class="product-title" title="${escapeHtml(product.title)}">${escapeHtml(product.title)}</h3>
          <div class="product-footer">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              Add
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Helper to escape HTML to prevent XSS issues
function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Setup Interactive UI Event Listeners
function setupEventListeners() {
  // Search input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    if (searchQuery.length > 0) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
    applyFiltersAndRender();
  });

  // Clear search button
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    applyFiltersAndRender();
  });

  // Price slider input
  priceRange.addEventListener('input', (e) => {
    maxPriceFilter = parseFloat(e.target.value);
    priceDisplay.textContent = `$${maxPriceFilter}`;
    applyFiltersAndRender();
  });

  // Cart drawer open/close
  cartBtn.addEventListener('click', () => openCart());
  closeCartBtn.addEventListener('click', () => closeCart());
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) closeCart();
  });

  // Checkout button
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your cart is currently empty!');
      return;
    }
    showToast('🎉 Thank you for your order! Checkout simulation successful.');
    cart = [];
    saveCart();
    closeCart();
  });
}

function openCart() {
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('open');
  document.body.style.overflow = 'auto';
}

// Cart Functions
function addToCart(productId) {
  const targetProduct = products.find(p => p.id === productId);
  if (!targetProduct) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: targetProduct.id,
      title: targetProduct.title,
      price: targetProduct.price,
      image: targetProduct.image,
      quantity: 1
    });
  }

  saveCart();
  showToast(`Added "${targetProduct.title.substring(0, 24)}..." to cart!`);
}

function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

// Update Cart Modal and Badges UI
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartBadge.textContent = totalItems;
  cartCountTitle.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
  cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  cartTotalEl.textContent = `$${subtotal.toFixed(2)}`;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <svg class="cart-empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <p>Your cart is empty</p>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${escapeHtml(item.title)}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</div>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span class="qty-text">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="Remove item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `).join('');
  }
}

// Show Toast Feedback Message
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${escapeHtml(message)}</span>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}
