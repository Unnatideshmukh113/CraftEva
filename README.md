# 🎨 CraftEva — Handmade Artisan E-Commerce Platform

> A full-stack e-commerce marketplace for handmade & artisan products, built with **Spring Boot** and **React**.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Frontend](#frontend)
- [Backend](#backend)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [How to Run](#how-to-run)
- [Data Flow](#data-flow)
- [Screenshots](#screenshots)
- [Contributors](#contributors)

---

## 📖 About the Project

**CraftEva** is a multi-role e-commerce platform connecting artisan sellers with buyers looking for unique handmade products. The platform supports three user roles — **Buyer**, **Seller**, and **Admin** — each with tailored dashboards and features.

**Key Features:**
- 🛍️ Browse & filter handcrafted products by category (Jewelry, Pottery, Paintings, etc.)
- 🛒 Shopping cart with real-time item management
- ❤️ Wishlist for saving favorite products
- 📦 Order placement, tracking, and history
- 💳 Payment processing with invoice generation (PDF)
- 🏪 Seller dashboard for product CRUD and payment tracking
- 📊 Admin dashboard with platform-wide statistics
- 🔐 JWT-based authentication with role-based access control

---

## 🛠️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 19, Vite 7, React Router 6 |
| Backend     | Java 21, Spring Boot 3.5.7       |
| Database    | MySQL 8+                          |
| Auth        | JWT (jjwt 0.12.3) + Spring Security |
| ORM         | JPA / Hibernate                   |
| API Docs    | Swagger UI (SpringDoc OpenAPI)    |
| PDF Engine  | iText 8                           |
| Build Tools | Maven (backend), npm (frontend)   |

---

## 🏗️ Project Architecture

```
┌─────────────────────┐       HTTP/JSON (REST)       ┌──────────────────────────┐
│    FRONTEND (SPA)   │ ──────────────────────────▶  │      BACKEND (API)       │
│   React 19 + Vite   │ ◀──────────────────────────  │  Spring Boot 3.5 (Java)  │
│   Port: 5173        │     JWT Bearer Token          │  Port: 8080              │
└─────────────────────┘                               └───────────┬──────────────┘
                                                                  │ JPA/Hibernate
                                                                  ▼
                                                      ┌──────────────────────────┐
                                                      │       MySQL Database     │
                                                      │    Schema: crafteva      │
                                                      │    Port: 3306            │
                                                      └──────────────────────────┘
```

**Pattern:** Monolithic REST API with separate SPA frontend. Stateless JWT authentication (no server sessions).

---

## 📁 Folder Structure

```
CraftEva/
├── crafteva-backend/
│   └── springboot_backend_template/
│       ├── pom.xml
│       └── src/main/java/com/crafteva/
│           ├── Application.java              # Entry point
│           ├── config/SecurityConfig.java     # Security + CORS
│           ├── controller/                    # REST controllers
│           │   ├── AuthController.java        #   Login / Register
│           │   ├── ProductController.java     #   Product CRUD
│           │   ├── OrderController.java       #   Order management
│           │   ├── OrderItemController.java   #   Cart items
│           │   ├── PaymentController.java     #   Payments
│           │   ├── InvoiceController.java     #   PDF invoices
│           │   └── AdminController.java       #   Admin dashboard
│           ├── dto/                           # Data Transfer Objects
│           ├── entity/                        # JPA entities
│           │   ├── User.java, Product.java, Order.java
│           │   ├── OrderItem.java, Payment.java
│           │   └── Role.java, Category.java (enums)
│           ├── repository/                    # Spring Data JPA repos
│           ├── services/                      # Business logic
│           ├── security/                      # JWT + auth filter
│           └── exceptions/                    # Error handling
│
├── crafteva_frontend/
│   └── vite-project/
│       ├── package.json
│       └── src/
│           ├── App.jsx                        # Routing + providers
│           ├── api/axios.js                   # API client + JWT interceptor
│           ├── auth/ProtectedRoute.jsx        # Route guard
│           ├── context/
│           │   ├── AuthContext.jsx             # Auth state
│           │   ├── CartContext.jsx             # Cart state
│           │   └── WishlistContext.jsx         # Wishlist state
│           ├── components/
│           │   ├── common/ (Header, Footer)
│           │   ├── product/ (ProductCard, ProductList)
│           │   ├── cart/ (CartItem)
│           │   └── invoice/ (Invoice)
│           └── pages/
│               ├── Home.jsx, Login.jsx, Register.jsx
│               ├── Cart.jsx, Payment.jsx, Wishlist.jsx
│               ├── Orders.jsx, OrderHistory.jsx
│               ├── SellerDashboard.jsx, AdminDashboard.jsx
│               └── AboutUs.jsx
│
├── Logger/                  # Separate logging microservice
├── render.yaml              # Render.com deployment config
└── README.md
```

---

## 🖥️ Frontend

### Overview

Single-page React application with role-based routing:

| Page | Route | Role | Description |
|------|-------|------|-------------|
| Home | `/` | Public | Product catalog with category filter |
| About | `/about` | Public | About CraftEva |
| Login | `/login` | Public | Email + password login |
| Register | `/register` | Public | New user registration |
| Cart | `/cart` | Buyer | Shopping cart management |
| Wishlist | `/wishlist` | Buyer | Saved products |
| Orders | `/orders` | Buyer | Active orders |
| Order History | `/order-history` | Buyer | Completed orders |
| Payment | `/payment` | Buyer | Checkout & invoice |
| Seller Dashboard | `/seller` | Seller | Manage products & view payments |
| Admin Dashboard | `/admin` | Admin | Platform statistics & management |

### State Management

Three React Context providers manage global state:
- **AuthContext** — JWT token, user session, login/logout (sessionStorage)
- **CartContext** — Shopping cart tied to backend orders (sessionStorage + API)
- **WishlistContext** — Local wishlist (localStorage)

---

## ⚙️ Backend

### Overview

Layered Spring Boot application following the pattern:

```
Controller → Service → Repository → Entity → MySQL
```

- **Spring Security** with JWT-based stateless auth
- **BCrypt** password hashing
- **Bean Validation** on all request DTOs
- **iText 8** for PDF invoice generation
- **Swagger UI** auto-generated API docs

---

## 🔌 API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → JWT token |

### Products (Read=Public, Write=Auth)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List all products | No |
| POST | `/api/products` | Add product | SELLER |
| PUT | `/api/products/{id}` | Update product | SELLER |
| DELETE | `/api/products/{id}` | Delete product | SELLER |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders/add` | Place order | BUYER |
| GET | `/api/orders/buyer/{buyerId}` | My orders | BUYER |
| GET | `/api/orders/history/{buyerId}` | Order history | BUYER |
| PUT | `/api/orders/cancel/{id}` | Cancel order | BUYER |

### Cart (Order Items)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/order-items/add` | Add to cart | BUYER |
| GET | `/api/order-items/order/{orderId}` | View cart | BUYER |
| DELETE | `/api/order-items/{id}` | Remove item | BUYER |

### Payments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments` | Make payment | BUYER |
| GET | `/api/payments/seller/{sellerId}` | Seller payments | SELLER |

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard` | Stats | ADMIN |
| GET | `/api/admin/users` | All users | ADMIN |
| DELETE | `/api/admin/users/{id}` | Delete user | ADMIN |
| GET | `/api/admin/orders` | All orders | ADMIN |
| GET | `/api/admin/payments` | All payments | ADMIN |

### Invoices

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/invoices/order/{orderId}` | Download PDF | BUYER |

---

## 🗄️ Database Schema

```
users                        products                     orders
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│ user_id (PK)     │◀──┐     │ product_id (PK)  │         │ order_id (PK)    │
│ user_name        │   │     │ product_name     │    ┌───▶│ buyer_id (FK)    │
│ user_email       │   ├─────│ seller_id (FK)   │    │    │ order_date       │
│ user_password    │   │     │ description      │    │    │ status (ENUM)    │
│ mobile_no        │   │     │ price            │    │    │ total_amount     │
│ user_address     │   │     │ image_URL        │    │    └────────┬─────────┘
│ role (ENUM)      │───┘     │ category (ENUM)  │    │             │
└──────────────────┘         └──────────────────┘    │    order_items
        │                                            │    ┌──────────────────┐
        │ (as buyer)                                 │    │ order_item_id(PK)│
        └────────────────────────────────────────────┘    │ order_id (FK)    │
                                                          │ product_id (FK)  │
payment                                                   │ quantity         │
┌──────────────────┐                                      │ price            │
│ payment_id (PK)  │                                      └──────────────────┘
│ amount           │
│ payment_status   │
│ transaction_id   │
│ payment_date     │
│ order_id (FK)    │
│ seller_id (FK)   │
└──────────────────┘
```

**Enums:** `Role` (BUYER, SELLER, ADMIN) · `OrderStatus` (PLACED, SHIPPED, DELIVERED, CANCELLED) · `PaymentStatus` (SUCCESS, FAILED, PENDING) · `Category` (HANDMADE_JEWELRY, HOME_DECOR, POTTERY, PAPER_CRAFT, PAINTINGS, FASHION_ACCESSORIES)

---

## ⚙️ Setup & Installation

### Prerequisites

| Tool | Version |
|------|---------|
| [Java JDK](https://adoptium.net/) | 21+ |
| [Node.js](https://nodejs.org/) | 18+ |
| [MySQL](https://dev.mysql.com/downloads/) | 8+ |
| [Maven](https://maven.apache.org/) | 3.9+ (or use included wrapper) |
| [Git](https://git-scm.com/) | Latest |

### Clone the Repository

```bash
git clone https://github.com/Unnatideshmukh113/CraftEva.git
cd CraftEva
```

### Install Dependencies

**Backend:**
```bash
cd crafteva-backend/springboot_backend_template
./mvnw clean install -DskipTests     # Linux/Mac
mvnw.cmd clean install -DskipTests   # Windows
```

**Frontend:**
```bash
cd crafteva_frontend/vite-project
npm install
```

---

## 🔐 Environment Variables

Configure in `crafteva-backend/springboot_backend_template/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/crafteva?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root

# JWT
jwt.secret=YOUR_SECRET_KEY_HERE
jwt.expiration=86400000
```

> ⚠️ **For production:** Use environment variables instead of hardcoded values.

---

## 🚀 How to Run

### 1. Start MySQL
Ensure MySQL is running on `localhost:3306`. The database `crafteva` will be auto-created.

### 2. Start Backend
```bash
cd crafteva-backend/springboot_backend_template
mvnw.cmd spring-boot:run
```
✅ Backend: **http://localhost:8080**
📖 Swagger: **http://localhost:8080/swagger-ui.html**

### 3. Start Frontend
```bash
cd crafteva_frontend/vite-project
npm run dev
```
✅ Frontend: **http://localhost:5173**

---

## 🔄 Data Flow

```
User clicks "Add to Cart"
        │
        ▼
  ProductCard.jsx (Frontend)
  → CartContext.addToCart()
        │
        ├──▶ POST /api/orders/add         (creates cart order in DB)
        │         ↓
        │    OrderController → OrderService → MySQL
        │
        └──▶ POST /api/order-items/add    (adds product to order)
                  ↓
             OrderItemController → OrderItemService → MySQL
                  ↓
             GET /api/order-items/order/{id}  (refresh cart)
                  ↓
             JSON response → CartContext state → Header re-renders
                  ↓
             User sees updated cart count ✅
```

---

## 📸 Screenshots

> Screenshots can be added in the `/assets` folder and referenced here.

| Page | Description |
|------|-------------|
| Home | Product catalog with category filter |
| Login / Register | Authentication forms |
| Cart | Shopping cart with item management |
| Payment | Checkout flow with invoice |
| Seller Dashboard | Product CRUD & payment tracking |
| Admin Dashboard | Platform statistics |

---

## 👨‍💻 Contributors

| Name | Role | GitHub |
|------|------|--------|
| Unnati Deshmukh | Full Stack Developer | [@Unnatideshmukh113](https://github.com/Unnatideshmukh113) |

---

## 📄 License

This project is built as part of the **DAC (Diploma in Advanced Computing)** program.

---

*Made with ❤️ by the CraftEva Team*
