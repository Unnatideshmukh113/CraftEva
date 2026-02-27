# 🎨 CraftEva — Handcraft E-Commerce Marketplace

<div align="center">

[![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen?style=for-the-badge&logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**A full-stack marketplace platform connecting artisans and craft lovers — buy, sell, and manage handcrafted products with ease.**

[📖 Documentation](#-getting-started) · [🚀 Deployment Guide](DEPLOYMENT.md) · [⚡ Quick Start](DEPLOYMENT_QUICKSTART.md) · [🤝 Contributing](CONTRIBUTING.md)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Authentication Flow](#-authentication-flow)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Project Overview

CraftEva is a complete handcraft e-commerce marketplace solution. The platform provides:

- **Customer Portal** — Browse craft products, manage wishlist, add to cart, place orders, and track deliveries
- **Seller Dashboard** — List and manage craft products, view incoming orders, track revenue
- **Admin Dashboard** — Platform-wide management of users, products, and orders
- **Secure Authentication** — JWT-based authentication with role-based access control (Customer, Seller, Admin)
- **Invoice Generation** — Automatic PDF invoice generation for every completed order

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Core language |
| Spring Boot | 3.5.7 | Application framework |
| Spring Security | Included | Authentication & authorization |
| Spring Data JPA | Included | Database ORM layer |
| MySQL | 8.0+ | Relational database |
| JWT (jjwt) | 0.12.3 | Stateless token auth |
| Lombok | Latest | Boilerplate reduction |
| ModelMapper | 3.2.5 | DTO ↔ Entity mapping |
| SpringDoc OpenAPI | 2.8.14 | Swagger API docs |
| iTextPDF | 8.0.2 | Invoice PDF generation |
| Maven | Included | Build tool |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI framework |
| Vite | 7.x | Build tool & dev server |
| React Router DOM | 6.x | Client-side routing |
| Axios | 1.6.x | HTTP client |

---

## ✨ Features

### 👤 Customer Features
- ✅ User registration and secure login
- ✅ Browse craft products and search
- ✅ Wishlist management (save favourite items)
- ✅ Shopping cart and checkout
- ✅ Secure payment processing
- ✅ View order history and current status
- ✅ Download PDF invoice for any order

### 🏪 Seller Features
- ✅ Seller account registration and login
- ✅ Product listing management (Create, Read, Update, Delete)
- ✅ View orders received for their products
- ✅ Seller dashboard with sales overview
- ✅ Manage product inventory and availability

### 🔧 Admin Features
- ✅ Secure admin login
- ✅ Admin dashboard with platform statistics
- ✅ User management (customers and sellers)
- ✅ Product moderation and management
- ✅ Order management and oversight
- ✅ Payment tracking

### 🔐 Security Features
- ✅ JWT-based stateless authentication
- ✅ Role-based access control (RBAC) — Customer / Seller / Admin
- ✅ BCrypt password encryption
- ✅ Secure REST API endpoints
- ✅ CORS configuration for frontend-backend separation

---

## 📁 Project Structure

```
CraftEva/
├── crafteva-backend/
│   └── springboot_backend_template/       # Spring Boot REST API
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/crafteva/
│       │   │   │   ├── config/            # Security, CORS, Swagger config
│       │   │   │   ├── controller/        # REST Controllers
│       │   │   │   │   ├── AdminController.java
│       │   │   │   │   ├── AuthController.java
│       │   │   │   │   ├── InvoiceController.java
│       │   │   │   │   ├── OrderController.java
│       │   │   │   │   ├── OrderItemController.java
│       │   │   │   │   ├── PaymentController.java
│       │   │   │   │   └── ProductController.java
│       │   │   │   ├── dto/               # Data Transfer Objects
│       │   │   │   ├── entity/            # JPA Entities
│       │   │   │   ├── exceptions/        # Custom exception handling
│       │   │   │   ├── repository/        # Data Access Layer
│       │   │   │   ├── security/          # JWT & Spring Security
│       │   │   │   └── services/          # Business Logic
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       ├── pom.xml
│       └── README.md
│
├── crafteva_frontend/
│   └── vite-project/                      # React + Vite Frontend
│       ├── src/
│       │   ├── api/                       # API call configurations
│       │   ├── auth/                      # Auth utilities/guards
│       │   ├── components/                # Reusable UI components
│       │   ├── context/                   # React context providers
│       │   ├── pages/                     # Page-level components
│       │   │   ├── Home.jsx               # Landing / product browse
│       │   │   ├── Login.jsx              # Authentication page
│       │   │   ├── Register.jsx           # User registration
│       │   │   ├── Cart.jsx               # Shopping cart
│       │   │   ├── Payment.jsx            # Checkout & payment
│       │   │   ├── Orders.jsx             # Order listing
│       │   │   ├── OrderHistory.jsx       # Order history
│       │   │   ├── Wishlist.jsx           # Saved items
│       │   │   ├── SellerDashboard.jsx    # Seller management
│       │   │   ├── AdminDashboard.jsx     # Admin control panel
│       │   │   └── AboutUs.jsx            # About page
│       │   ├── service/                   # API service layer
│       │   ├── App.jsx                    # Root component & routes
│       │   └── main.jsx                   # App entry point
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js
│       └── README.md
│
├── Logger/                                # Logging utilities
├── assets/                                # Images, logos, screenshots
├── Project Report/                        # Project documentation
├── .gitignore
├── .vscode/                               # VS Code workspace config
├── CHANGELOG.md
├── CONTRIBUTING.md
├── DEPLOYMENT.md
├── DEPLOYMENT_QUICKSTART.md
├── LICENSE
├── README.md                              # This file
└── render.yaml                            # Render.com deployment config
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|---|---|---|
| Java | 21+ | [Download](https://adoptium.net/) |
| Maven | 3.8+ | [Download](https://maven.apache.org/) |
| Node.js | 18+ | [Download](https://nodejs.org/) |
| MySQL | 8.0+ | [Download](https://dev.mysql.com/downloads/) |
| Git | Latest | [Download](https://git-scm.com/) |

---

### 1. Clone the Repository

```bash
git clone https://github.com/Unnatideshmukh113/CraftEva.git
cd CraftEva
```

---

### 2. Backend Setup

```bash
cd crafteva-backend/springboot_backend_template
```

**Create a MySQL database:**

```sql
CREATE DATABASE crafteva_db;
```

**Configure `src/main/resources/application.properties`:**

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/crafteva_db
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT
jwt.secret=your_jwt_secret_key_at_least_256_bits
jwt.expiration=86400000

# Server
server.port=8080
```

**Run the backend:**

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

✅ Backend starts at: **http://localhost:8080**
📖 Swagger UI: **http://localhost:8080/swagger-ui/index.html**

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd crafteva_frontend/vite-project
npm install
npm run dev
```

✅ Frontend starts at: **http://localhost:5173**

---

## 🔐 Authentication Flow

```
1. User registers / logs in → POST /api/auth/register or /api/auth/login
2. Server validates credentials → Returns JWT token
3. Client stores token (localStorage / sessionStorage)
4. All subsequent requests include: Authorization: Bearer <token>
5. Spring Security filter validates token and sets security context
6. Role-based access enforced per endpoint (CUSTOMER / SELLER / ADMIN)
```

**Roles:**
| Role | Access |
|---|---|
| `CUSTOMER` | Browse products, cart, orders, wishlist, payments |
| `SELLER` | All customer access + seller dashboard, product management |
| `ADMIN` | Full platform access, user & product administration |

---

## 📖 API Documentation

Full interactive API docs available via Swagger UI once the backend is running:

🔗 **http://localhost:8080/swagger-ui/index.html**

**Key API Endpoints:**

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login & get JWT token |
| `GET` | `/api/products` | List all products |
| `POST` | `/api/products` | Create product (Seller) |
| `GET` | `/api/orders` | Get user's orders |
| `POST` | `/api/orders` | Place new order |
| `GET` | `/api/payments` | View payment history |
| `POST` | `/api/payments` | Process payment |
| `GET` | `/api/invoice/{orderId}` | Download PDF invoice |
| `GET` | `/api/admin/**` | Admin operations |

---

## 🌐 Deployment

See the full deployment guides:

- 📄 **[DEPLOYMENT.md](DEPLOYMENT.md)** — Detailed step-by-step guide for Render, Vercel, and Netlify
- ⚡ **[DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md)** — Quick 5-step deployment

**Supported Platforms:**
- Backend → [Render](https://render.com) (JAR deployment) or any Java-compatible cloud
- Frontend → [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- Database → [PlanetScale](https://planetscale.com) / [Aiven](https://aiven.io) / [Railway](https://railway.app)

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👥 Author

**Unnati Deshmukh**  
GitHub: [@Unnatideshmukh113](https://github.com/Unnatideshmukh113)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/Unnatideshmukh113">Unnatideshmukh113</a>
</div>