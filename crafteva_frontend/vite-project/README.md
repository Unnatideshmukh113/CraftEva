# CraftEva Frontend — React + Vite

This is the frontend application for CraftEva, built with **React 19** and **Vite 7**.

## 📦 Tech Stack

- React 19.2.0
- Vite 7.x (build tool & dev server)
- React Router DOM 6.x (client-side routing)
- Axios 1.6.x (HTTP client)

## 📁 Project Structure

```
src/
├── api/                    # Axios instances and API base config
├── auth/                   # Auth guards and protected routes
├── components/             # Reusable UI components
├── context/                # React Context providers (auth, cart, etc.)
├── pages/                  # Page-level components
│   ├── Home.jsx            # Product browse & landing page
│   ├── Login.jsx           # Login form
│   ├── Register.jsx        # User registration
│   ├── Cart.jsx            # Shopping cart
│   ├── Payment.jsx         # Checkout & payment
│   ├── Orders.jsx          # Active orders
│   ├── OrderHistory.jsx    # Past order history
│   ├── Wishlist.jsx        # Saved products
│   ├── SellerDashboard.jsx # Seller product & order management
│   ├── AdminDashboard.jsx  # Admin control panel
│   └── AboutUs.jsx         # About page
├── service/                # API service functions (per resource)
├── App.jsx                 # Root component with routing
├── main.jsx                # App entry point
├── App.css                 # Global component styles
└── index.css               # Global base styles
```

## ⚙️ Configuration

Create a `.env` file in this directory:

```env
# Local development
VITE_API_BASE_URL=http://localhost:8080

# Production
# VITE_API_BASE_URL=https://crafteva-backend.onrender.com
```

## 🚀 Running Locally

```bash
# Prerequisites: Node.js 18+, npm

npm install
npm run dev
```

App starts at: **http://localhost:5173**

## 🏗️ Build for Production

```bash
npm run build
# Output in: dist/
```

Preview production build:

```bash
npm run preview
```

## 🔗 Routing Overview

| Route | Component | Access |
|---|---|---|
| `/` | `Home.jsx` | Public |
| `/login` | `Login.jsx` | Public |
| `/register` | `Register.jsx` | Public |
| `/about` | `AboutUs.jsx` | Public |
| `/cart` | `Cart.jsx` | Customer |
| `/payment` | `Payment.jsx` | Customer |
| `/orders` | `Orders.jsx` | Customer |
| `/order-history` | `OrderHistory.jsx` | Customer |
| `/wishlist` | `Wishlist.jsx` | Customer |
| `/seller` | `SellerDashboard.jsx` | Seller |
| `/admin` | `AdminDashboard.jsx` | Admin |
