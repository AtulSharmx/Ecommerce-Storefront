// ============================
// My Shop - Main JavaScript
// ============================

// USD to INR conversion rate
var USD_TO_INR = 84;

// Custom product names (so it looks like I made it)
var myProductNames = {
  1:  "Men's Canvas Backpack",
  2:  "Cotton Round Neck T-Shirt",
  3:  "Men's Slim Fit Jacket",
  4:  "Men's Full Sleeve T-Shirt",
  5:  "Men's Sport Jacket",
  6:  "Men's Slim Fit Jeans",
  7:  "Men's Casual Shirt",
  8:  "Men's Hoodie Pullover",
  9:  "Silver Dragon Bracelet",
  10: "Gold Petite Ring",
  11: "Diamond Style Ring Set",
  12: "Rose Gold Couple Rings",
  13: "White Gold Pendant",
  14: "Gold Chain Necklace",
  15: "Silver Charm Bracelet",
  16: "Women's Leather Jacket",
  17: "Women's Printed T-Shirt",
  18: "Women's Winter Coat",
  19: "Women's Cotton Kurti",
  20: "Portable Hard Drive 2TB"
};

// All my store data
var products = [];
var categories = [];
var cart = [];

// Current filter values
var activeCategory = "all";
var maxPrice = 1000;
var searchText = "";

// Get all the HTML elements I need
var productsGrid = document.getElementById("products-grid");
var categoriesBox = document.getElementById("categories-container");
var searchInput = document.getElementById("search-input");
var clearBtn = document.getElementById("clear-search-btn");
var priceSlider = document.getElementById("price-range");
var priceLabel = document.getElementById("price-display");
var countLabel = document.getElementById("results-count");

var cartBtn = document.getElementById("cart-btn");
var cartOverlay = document.getElementById("cart-drawer-overlay");
var closeCartBtn = document.getElementById("close-cart-btn");
var cartBadge = document.getElementById("cart-badge");
var cartCountTitle = document.getElementById("cart-count-title");
var cartItemsBox = document.getElementById("cart-items-container");
var cartSubtotal = document.getElementById("cart-subtotal");
var cartTotal = document.getElementById("cart-total");
var checkoutBtn = document.getElementById("checkout-btn");
var toastBox = document.getElementById("toast-container");

// Start the app when page loads
document.addEventListener("DOMContentLoaded", function() {
  loadCart();
  showSkeletons();
  loadProducts();
  setupListeners();
});

// Load saved cart from browser storage
function loadCart() {
  var saved = localStorage.getItem("my_cart");
  if (saved) {
    cart = JSON.parse(saved);
  }
  updateCartUI();
}

// Save cart to browser storage
function saveCart() {
  localStorage.setItem("my_cart", JSON.stringify(cart));
  updateCartUI();
}

// Get products from the API
async function loadProducts() {
  try {
    var productReq = await fetch("https://fakestoreapi.com/products");
    var categoryReq = await fetch("https://fakestoreapi.com/products/categories");

    products = await productReq.json();
    categories = await categoryReq.json();

    // Find the highest price and set slider max
    var highest = 0;
    for (var i = 0; i < products.length; i++) {
      var inrPrice = Math.ceil(products[i].price * USD_TO_INR);
      if (inrPrice > highest) {
        highest = inrPrice;
      }
    }
    maxPrice = highest;
    priceSlider.max = highest;
    priceSlider.value = highest;
    priceLabel.textContent = "₹" + highest;

    showCategories();
    filterAndShow();

  } catch (error) {
    console.error("Could not load products:", error);
    productsGrid.innerHTML = '<div class="no-products-container"><div class="no-products-title">Could Not Load Products</div><div class="no-products-text">Check your internet connection and refresh the page.</div></div>';
    countLabel.textContent = "0 products";
  }
}

// Show skeleton loading cards while data loads
function showSkeletons() {
  var html = "";
  for (var i = 0; i < 8; i++) {
    html += '<div class="skeleton-card"><div class="skeleton-box" style="height: 160px;"></div><div class="skeleton-box" style="height: 16px; width: 40%; margin-top: 4px;"></div><div class="skeleton-box" style="height: 36px; width: 90%;"></div><div class="skeleton-box" style="height: 28px; width: 50%; margin-top: auto;"></div></div>';
  }
  productsGrid.innerHTML = html;
}

// Show category filter buttons
function showCategories() {
  var html = '<button class="category-pill active" data-category="all">All</button>';

  for (var i = 0; i < categories.length; i++) {
    var cat = categories[i];
    html += '<button class="category-pill" data-category="' + cat + '">' + cat + '</button>';
  }

  categoriesBox.innerHTML = html;

  // Add click event to each pill
  var pills = categoriesBox.querySelectorAll(".category-pill");
  for (var j = 0; j < pills.length; j++) {
    pills[j].addEventListener("click", function(e) {
      // Remove active from all pills
      for (var k = 0; k < pills.length; k++) {
        pills[k].classList.remove("active");
      }
      // Add active to clicked pill
      e.target.classList.add("active");
      activeCategory = e.target.getAttribute("data-category");
      filterAndShow();
    });
  }
}

// Filter products and show them
function filterAndShow() {
  var filtered = [];

  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var inrPrice = Math.ceil(p.price * USD_TO_INR);

    // Check each filter
    var matchSearch = p.title.toLowerCase().includes(searchText.toLowerCase());
    var matchCategory = activeCategory === "all" || p.category === activeCategory;
    var matchPrice = inrPrice <= maxPrice;

    if (matchSearch && matchCategory && matchPrice) {
      filtered.push(p);
    }
  }

  var count = filtered.length;
  countLabel.textContent = count + " product" + (count !== 1 ? "s" : "") + " found";
  showProducts(filtered);
}

// Show product cards on the page
function showProducts(list) {
  if (list.length === 0) {
    productsGrid.innerHTML = '<div class="no-products-container"><div class="no-products-title">No products found</div><div class="no-products-text">Try a different search or filter.</div></div>';
    return;
  }

  var html = "";

  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    var inrPrice = Math.ceil(p.price * USD_TO_INR);

    // Use my custom name if I have one, else use API name
    var name = myProductNames[p.id] || p.title;

    // Make star rating
    var stars = "★".repeat(Math.round(p.rating.rate)) + "☆".repeat(5 - Math.round(p.rating.rate));

    html += '<div class="product-card">';
    html += '  <div class="product-image-container">';
    html += '    <span class="product-category-badge">' + p.category + '</span>';
    html += '    <img src="' + p.image + '" alt="' + name + '" class="product-image" loading="lazy">';
    html += '  </div>';
    html += '  <div class="product-info">';
    html += '    <div class="product-rating"><span class="rating-stars">' + stars + '</span> <span>(' + p.rating.count + ')</span></div>';
    html += '    <h3 class="product-title">' + name + '</h3>';
    html += '    <div class="product-footer">';
    html += '      <span class="product-price">₹' + inrPrice.toLocaleString("en-IN") + '</span>';
    html += '      <button class="add-to-cart-btn" onclick="addToCart(' + p.id + ')">';
    html += '        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';
    html += '        Add';
    html += '      </button>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
  }

  productsGrid.innerHTML = html;
}

// Add a product to cart
function addToCart(productId) {
  var product = null;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      product = products[i];
      break;
    }
  }
  if (!product) return;

  // Check if product is already in cart
  var existing = null;
  for (var j = 0; j < cart.length; j++) {
    if (cart[j].id === productId) {
      existing = cart[j];
      break;
    }
  }

  if (existing) {
    existing.quantity = existing.quantity + 1;
  } else {
    var name = myProductNames[product.id] || product.title;
    cart.push({
      id: product.id,
      name: name,
      price: Math.ceil(product.price * USD_TO_INR),
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  showToast("Added to cart!");
}

// Change quantity of a cart item
function changeQuantity(productId, change) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity = cart[i].quantity + change;
      if (cart[i].quantity <= 0) {
        cart.splice(i, 1); // Remove from cart
      }
      break;
    }
  }
  saveCart();
}

// Remove item from cart
function removeItem(productId) {
  cart = cart.filter(function(item) {
    return item.id !== productId;
  });
  saveCart();
}

// Update the cart UI (badge, drawer, totals)
function updateCartUI() {
  var totalItems = 0;
  var totalPrice = 0;

  for (var i = 0; i < cart.length; i++) {
    totalItems = totalItems + cart[i].quantity;
    totalPrice = totalPrice + (cart[i].price * cart[i].quantity);
  }

  cartBadge.textContent = totalItems;
  cartCountTitle.textContent = totalItems + " item" + (totalItems !== 1 ? "s" : "");
  cartSubtotal.textContent = "₹" + totalPrice.toLocaleString("en-IN");
  cartTotal.textContent = "₹" + totalPrice.toLocaleString("en-IN");

  if (cart.length === 0) {
    cartItemsBox.innerHTML = '<div class="cart-empty-state"><svg class="cart-empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><p>Your cart is empty</p></div>';
    return;
  }

  var html = "";
  for (var j = 0; j < cart.length; j++) {
    var item = cart[j];
    html += '<div class="cart-item">';
    html += '  <img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img">';
    html += '  <div class="cart-item-details">';
    html += '    <div class="cart-item-title">' + item.name + '</div>';
    html += '    <div class="cart-item-price">₹' + (item.price * item.quantity).toLocaleString("en-IN") + '</div>';
    html += '    <div class="cart-item-controls">';
    html += '      <button class="qty-btn" onclick="changeQuantity(' + item.id + ', -1)">-</button>';
    html += '      <span class="qty-text">' + item.quantity + '</span>';
    html += '      <button class="qty-btn" onclick="changeQuantity(' + item.id + ', 1)">+</button>';
    html += '    </div>';
    html += '  </div>';
    html += '  <button class="remove-item-btn" onclick="removeItem(' + item.id + ')">';
    html += '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
    html += '  </button>';
    html += '</div>';
  }
  cartItemsBox.innerHTML = html;
}

// Open the cart drawer
function openCart() {
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

// Close the cart drawer
function closeCart() {
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "auto";
}

// Show a small toast message at the bottom
function showToast(message) {
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> <span>' + message + '</span>';
  toastBox.appendChild(toast);

  setTimeout(function() {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}

// Setup all button and input listeners
function setupListeners() {
  // Search box
  searchInput.addEventListener("input", function(e) {
    searchText = e.target.value;
    if (searchText.length > 0) {
      clearBtn.classList.remove("hidden");
    } else {
      clearBtn.classList.add("hidden");
    }
    filterAndShow();
  });

  // Clear search button
  clearBtn.addEventListener("click", function() {
    searchInput.value = "";
    searchText = "";
    clearBtn.classList.add("hidden");
    filterAndShow();
  });

  // Price slider
  priceSlider.addEventListener("input", function(e) {
    maxPrice = parseInt(e.target.value);
    priceLabel.textContent = "₹" + maxPrice.toLocaleString("en-IN");
    filterAndShow();
  });

  // Cart open/close
  cartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", function(e) {
    if (e.target === cartOverlay) closeCart();
  });

  // Checkout button
  checkoutBtn.addEventListener("click", function() {
    if (cart.length === 0) {
      showToast("Your cart is empty!");
      return;
    }
    showToast("Order placed! Thank you.");
    cart = [];
    saveCart();
    closeCart();
  });
}
