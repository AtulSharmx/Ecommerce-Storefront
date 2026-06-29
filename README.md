# ShopFront — E-Commerce Storefront

Live Demo: https://ecommerce-storefront-livid.vercel.app

## Screenshots

![Product grid — all products loaded from FakeStoreAPI](screenshot1.png)

![Live search — typing filters the grid in real-time](screenshot2.png)

![Cart sidebar — items added, live total updating](screenshot3.png)

## About This Project

ShopFront is a small e-commerce product listing page I built as a portfolio project while applying for frontend developer internships. It fetches real product data from [FakeStoreAPI](https://fakestoreapi.com/), lets you search and filter through them, and has a working cart with a live total. Everything runs in the browser — no backend, no database.

## Tech Stack

- **HTML5** — Semantic markup & accessible accessibility layout
- **CSS3** — Custom design system, modern gradients, flex/grid layouts, glassmorphic styling & smooth animations
- **Vanilla JavaScript (ES6+)** — Beginner-friendly client-side logic for dynamic filtering, state management & API interaction
- **FakeStoreAPI** — Real-time live product and category data integration

## Features

- **Responsive Product Grid**: Modern glassmorphic cards with ratings, dynamic badges, and hover animations.
- **Combined Real-Time Filtering**: Search keywords, select category pill filters, and adjust max price range sliders simultaneously.
- **Cart Sidebar Drawer**: Smooth slide-over drawer with live subtotal calculation, item quantity controls (+/-), item removal, and localStorage persistence.
- **Interactive Feedback**: Floating notification toasts for user actions (add to cart, checkout).
- **Skeleton Loading State**: Smooth animated skeleton loaders while fetching API data.

## Run Locally

Simply open `index.html` in any web browser! No `npm install` or build process required.

```bash
# Clone the repo
git clone https://github.com/AtulSharmx/Ecommerce-Storefront.git
cd Ecommerce-Storefront

# Open index.html directly in browser or using VS Code Live Server
```
