// FakeStore quotes prices in USD; this storefront shows INR.
const USD_TO_INR = 84;

// Product titles come from a third-party API, so they are never trusted as markup.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
let products = [];
let categories = [];
let cart = [];
let activeCat = 'all';
let maxPrice = 1000;
let searchText = '';

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

async function init() {
  loadCart();

  try {
    const [prodRes, catRes] = await Promise.all([
      fetch("https://fakestoreapi.com/products"),
      fetch("https://fakestoreapi.com/products/categories")
    ]);
    
    products = await prodRes.json();
    categories = await catRes.json();
    
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

function renderProducts() {
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

  grid.innerHTML = filtered.map(p => {
    const price = Math.ceil(p.price * USD_TO_INR);
    return `
      <div class="card">
        <div class="img-box">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy"
               onerror="this.parentElement.classList.add('img-failed'); this.remove();">
        </div>
        <div class="card-content">
          <h3>${escapeHtml(p.title)}</h3>
          <div class="card-footer">
            <p>₹${price.toLocaleString("en-IN")}</p>
            <button onclick="addToCart(${p.id}, ${price})">Add</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderCategories() {
  catBox.innerHTML = `
    <button class="active" data-cat="all">All</button>
    ${categories.map(c => `<button data-cat="${c}">${c}</button>`).join('')}
  `;
  
  catBox.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      catBox.querySelector('.active').classList.remove('active');
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      renderProducts();
    };
  });
}

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
  if (!item) return;
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
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  cartCount.textContent = totalItems;
  cartTotal.textContent = `₹${totalPrice.toLocaleString("en-IN")}`;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}"
           onerror="this.classList.add('img-failed');">
      <div class="cart-item-details">
        <h4>${escapeHtml(item.title)}</h4>
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

searchInput.oninput = (e) => { 
  searchText = e.target.value; 
  renderProducts(); 
};

priceInput.oninput = (e) => { 
  maxPrice = Number(e.target.value); 
  priceVal.textContent = `₹${maxPrice}`; 
  renderProducts(); 
};

document.getElementById('cart-btn').onclick = () => cartModal.classList.add('visible');
document.getElementById('close-cart').onclick = () => cartModal.classList.remove('visible');
cartModal.onclick = (e) => { if (e.target === cartModal) cartModal.classList.remove('visible'); };
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cartModal.classList.remove('visible');
});

document.getElementById('checkout').onclick = () => {
  if (cart.length === 0) return showToast("Cart is empty!");
  cart = []; 
  saveCart(); 
  cartModal.classList.remove('visible');
  showToast("Order Placed Successfully!");
};

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2500);
}

init();
