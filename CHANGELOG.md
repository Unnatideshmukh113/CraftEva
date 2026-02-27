# 📋 Changelog

All notable changes to CraftEva will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-02-27

### 🎉 Initial Release

#### Added
- **Authentication System** — JWT-based stateless authentication with role-based access control (Customer, Seller, Admin)
- **Product Management** — Full CRUD for craft product listings by sellers
- **Shopping Cart** — Add/remove items, quantity management, cart persistence
- **Wishlist** — Save favourite craft products for later
- **Order System** — Place orders, track status, view order history
- **Payment Processing** — Secure payment flow with order confirmation
- **Invoice Generation** — Automatic PDF invoice generation per order (via iTextPDF)
- **Seller Dashboard** — Product management and order tracking for sellers
- **Admin Dashboard** — Platform-wide user, product, and order management
- **Swagger API Docs** — Interactive API documentation via SpringDoc OpenAPI
- **React Frontend** — Responsive single-page application built with React 19 + Vite
- **Security** — BCrypt password hashing, CORS configuration, secure REST endpoints

#### Tech Stack
- Backend: Spring Boot 3.5.7, Java 21, MySQL, Spring Security, JWT
- Frontend: React 19, Vite 7, Axios, React Router DOM v6

---

## [Unreleased]

### Planned
- Product image upload and management
- Product category/tag system
- Email notifications for order updates
- Rating and review system for products
- Advanced search and filtering
- Seller analytics dashboard
- Customer wallet / store credit system
