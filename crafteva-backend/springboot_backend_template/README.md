# CraftEva Backend — Spring Boot REST API

This is the backend service for CraftEva, built with **Spring Boot 3.5.7** and **Java 21**.

## 📦 Tech Stack

- Spring Boot 3.5.7
- Spring Security 6 + JWT (jjwt 0.12.3)
- Spring Data JPA (Hibernate)
- MySQL 8.0+
- Lombok
- ModelMapper 3.2.5
- SpringDoc OpenAPI 2.8.14 (Swagger)
- iTextPDF 8.0.2 (Invoice generation)
- Maven

## 📁 Package Structure

```
src/main/java/com/crafteva/
├── Application.java          # Spring Boot entry point
├── config/                   # Security, CORS, Swagger, ModelMapper config
├── controller/               # REST Controllers
│   ├── AdminController.java  # Admin-only operations
│   ├── AuthController.java   # Login & Registration
│   ├── InvoiceController.java # PDF invoice download
│   ├── OrderController.java  # Order lifecycle
│   ├── OrderItemController.java
│   ├── PaymentController.java
│   └── ProductController.java # Product CRUD
├── dto/                      # Data Transfer Objects (request/response)
├── entity/                   # JPA Entity classes
├── exceptions/               # Global exception handler
├── repository/               # Spring Data JPA repositories
├── security/                 # JWT filter, UserDetailsService, SecurityConfig
└── services/                 # Business logic layer
```

## ⚙️ Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/crafteva_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=your_secret_key_minimum_32_characters
jwt.expiration=86400000

# Server
server.port=8080
```

## 🚀 Running Locally

```bash
# Prerequisites: Java 21, Maven, MySQL

# 1. Create database
mysql -u root -p -e "CREATE DATABASE crafteva_db;"

# 2. Configure application.properties (see above)

# 3. Run
./mvnw spring-boot:run          # Linux/macOS
mvnw.cmd spring-boot:run        # Windows
```

Server starts at: **http://localhost:8080**

## 📖 API Docs

Swagger UI: **http://localhost:8080/swagger-ui/index.html**

API Spec: **http://localhost:8080/v3/api-docs**

## 🏗️ Building for Production

```bash
./mvnw clean package -DskipTests
java -jar target/springboot_backend_template-0.0.1.jar
```
