// --- Configuration & State ---
const USD_TO_INR = 84;
let products = [];
let categories = [];
let cart = [];
let activeCat = 'all';
let maxPrice = 1000;
let searchText = '';

// --- DOM Elements ---
const grid = document.getElementById('grid');
const catBox = document.getElementById('categories');
const statusText = document.getElementById('status');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const toast = document.getElementById('toast');
const priceInput = document.getElementById('price');
const priceVal = document.getElementById('price-val');
const searchInput = document.getElementById('search');

// --- Initialization ---
async function init() {
  loadCart(); // Load saved cart from localStorage

  try {
    // Fetch data from FakeStore API
    const [prodRes, catRes] = await Promise.all([
      fetch("https://fakestoreapi.com/products"),
      fetch("https://fakestoreapi.com/products/categories")
    ]);
    
    products = await prodRes.json();
    categories = await catRes.json();
    
    // Set max price slider dynamically based on highest product price
    maxPrice = Math.max(...products.map(p => Math.ceil(p.price * USD_TO_INR)));
    priceInput.max = maxPrice;
    priceInput.value = maxPrice;
    priceVal.textContent = `₹${maxPrice}`;

    renderCategories();
    renderProducts();
  } catch (err) {
    statusText.textContent = "Failed to load products. Please check your connection.";
  }
}

// --- Render Products ---
function renderProducts() {
  // Filter products based on search, category, and price
  const filtered = products.filter(p => {
    const price = Math.ceil(p.price * USD_TO_INR);
    const matchCat = activeCat === 'all' || p.category === activeCat;
    const matchSearch = p.title.toLowerCase().includes(searchText.toLowerCase());
    return matchCat && matchSearch && price <= maxPrice;
  });

  statusText.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`;
  
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1;">No products match your filters.</p>';
    return;
  }

  // Generate HTML for each product using map() and template literals
  grid.innerHTML = filtered.map(p => {
    const price = Math.ceil(p.price * USD_TO_INR);
    return `
      <div class="card">
        <div class="img-box">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
        </div>
        <div class="card-content">
          <h3>${p.title}</h3>
          <div class="card-footer">
            <p>₹${price.toLocaleString("en-IN")}</p>
            <button onclick="addToCart(${p.id}, ${price})">Add</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --- Render Categories ---
function renderCategories() {
  // Generate HTML for category buttons
  catBox.innerHTML = `
    <button class="active" data-cat="all">All</button>
    ${categories.map(c => `<button data-cat="${c}">${c}</button>`).join('')}
  `;
  
  // Add click events to category buttons
  catBox.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      catBox.querySelector('.active').classList.remove('active');
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      renderProducts();
    };
  });
}

// --- Cart Logic ---
window.addToCart = function(id, price) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    const prod = products.find(p => p.id === id);
    cart.push({ id, title: prod.title, image: prod.image, price, qty: 1 });
  }
  saveCart();
  showToast("Item added to cart!");
};

window.updateQty = function(id, change) {
  const item = cart.find(i => i.id === id);
  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
};

function saveCart() {
  localStorage.setItem('my_cart', JSON.stringify(cart));
  renderCart();
}

function loadCart() {
  const saved = localStorage.getItem('my_cart');
  if (saved) cart = JSON.parse(saved);
  renderCart();
}

function renderCart() {
  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  cartCount.textContent = totalItems;
  cartTotal.textContent = `₹${totalPrice.toLocaleString("en-IN")}`;

  // Generate cart items HTML
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item-details">
        <h4>${item.title}</h4>
        <p>₹${(item.price * item.qty).toLocaleString("en-IN")}</p>
        <div class="qty-controls">
          <button onclick="updateQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

// --- UI Event Listeners ---
searchInput.oninput = (e) => { 
  searchText = e.target.value; 
  renderProducts(); 
};

priceInput.oninput = (e) => { 
  maxPrice = Number(e.target.value); 
  priceVal.textContent = `₹${maxPrice}`; 
  renderProducts(); 
};

// Modal controls
document.getElementById('cart-btn').onclick = () => cartModal.classList.add('visible');
document.getElementById('close-cart').onclick = () => cartModal.classList.remove('visible');
cartModal.onclick = (e) => { if (e.target === cartModal) cartModal.classList.remove('visible'); };

// Checkout
document.getElementById('checkout').onclick = () => {
  if (cart.length === 0) return showToast("Cart is empty!");
  cart = []; 
  saveCart(); 
  cartModal.classList.remove('visible');
  showToast("Order Placed Successfully!");
};

// Toast message
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2500);
}

// Run app
init();
