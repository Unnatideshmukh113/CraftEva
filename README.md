# 🎨 CraftEVA

**CraftEVA** is a full-stack web application built with a **Spring Boot** backend and a **React (Vite)** frontend. It features secure JWT-based authentication, RESTful API design, and a modern, responsive UI.

---

## 📁 Project Structure

```
CraftEVA-main/
├── crafteva-backend/
│   └── springboot_backend_template/   # Spring Boot REST API
│       ├── src/
│       ├── pom.xml
│       └── ...
├── crafteva_frontend/
│   └── vite-project/                  # React + Vite frontend
│       ├── src/
│       ├── index.html
│       ├── package.json
│       └── ...
└── Logger/                            # Logger utilities
```

---

## 🚀 Technologies Used

### Backend
| Technology | Version |
|---|---|
| Java | 21 |
| Spring Boot | 3.5.7 |
| Spring Security | Included |
| Spring Data JPA | Included |
| MySQL | Latest |
| JWT (jjwt) | 0.12.3 |
| Lombok | Latest |
| ModelMapper | 3.2.5 |
| SpringDoc OpenAPI (Swagger) | 2.8.14 |
| iTextPDF | 8.0.2 |
| Maven | Included (wrapper) |

### Frontend
| Technology | Version |
|---|---|
| React | 19.2.0 |
| Vite | 7.x |
| React Router DOM | 6.x |
| Axios | 1.6.x |

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- **Java 21+**
- **Maven 3.8+** (or use the included `mvnw` wrapper)
- **Node.js 18+** and **npm**
- **MySQL 8+**

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Unnatideshmukh113/CraftEva.git
cd CraftEva
```

### 2. Backend Setup

```bash
cd crafteva-backend/springboot_backend_template
```

Configure your database:

1. Create a MySQL database (e.g., `crafteva_db`)
2. Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/crafteva_db
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
```

Run the backend:

```bash
# Using Maven wrapper (recommended)
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```

The backend will start on **http://localhost:8080**

> 📖 Swagger API Docs: **http://localhost:8080/swagger-ui/index.html**

### 3. Frontend Setup

```bash
cd crafteva_frontend/vite-project
npm install
npm run dev
```

The frontend will start on **http://localhost:5173**

---

## 🔐 Authentication

CraftEVA uses **JWT (JSON Web Token)** for secure, stateless authentication via Spring Security.

- Users register/log in to receive a JWT token
- Token is sent in the `Authorization: Bearer <token>` header for protected routes

---

## 📦 API Documentation

Once the backend is running, visit:

**http://localhost:8080/swagger-ui/index.html**

for interactive API documentation powered by SpringDoc OpenAPI.

---

## 🏗️ Building for Production

### Backend
```bash
cd crafteva-backend/springboot_backend_template
./mvnw clean package -DskipTests
java -jar target/springboot_backend_template-0.0.1.jar
```

### Frontend
```bash
cd crafteva_frontend/vite-project
npm run build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source. Feel free to use and modify it.

---

*Made with ❤️ by [Unnatideshmukh113](https://github.com/Unnatideshmukh113)*