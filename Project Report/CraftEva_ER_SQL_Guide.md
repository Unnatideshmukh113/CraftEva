# CraftEva — ER Diagram Explanation & SQL Guide

> All table names, column names, constraint names, and JPA method names are taken directly from the CraftEva codebase.

---

## SECTION 1 — ER DIAGRAM OVERVIEW

### Entities & Purpose

| Entity | Table | Purpose |
|---|---|---|
| **User** | `users` | Central user table for all roles (BUYER, SELLER, ADMIN). Single-table design — role column distinguishes them. |
| **Product** | `products` | Craft product listings created by sellers. FK to users (seller). |
| **Order** | `orders` | A buyer's purchase. FK to users (buyer). Has many OrderItems. |
| **OrderItem** | `orderItems` | Junction/line-item table linking orders to products. Stores price at time of order. |
| **Payment** | `payment` | One-to-one with order. Records payment amount, status, transaction ID, and timestamp. FK to users (seller). |

---

### All Relationships

| Entity A | Cardinality | Entity B | Relationship | Description |
|---|---|---|---|---|
| User (SELLER) | 1:M | Product | "lists" | One seller lists many products |
| User (BUYER) | 1:M | Order | "places" | One buyer places many orders |
| Order | 1:M | OrderItem | "contains" | One order has many line items |
| Product | 1:M | OrderItem | "appears in" | One product can appear in many order items |
| Order | 1:1 | Payment | "paid by" | Every order has exactly one payment record |
| User (SELLER) | 1:M | Payment | "receives" | A seller receives payments for their products |

---

### IS-A / Single-Table Design Decision

**There is NO separate `buyers` / `sellers` / `admins` table.**

CraftEva uses a **single `users` table** with a `role` ENUM column:

```java
@Enumerated(EnumType.STRING)
private Role role;  // SELLER, BUYER, ADMIN
```

**Why?**
- Simpler authentication — one `findByEmail()` query regardless of role
- No complex JOIN needed during login
- Role-specific behaviour handled entirely in the service layer and `@PreAuthorize`
- Spring Security maps the role string directly: `"ROLE_" + role.name()`

---

## SECTION 2 — ALL TABLE STRUCTURES

### Table: `users`

| Column | Type | Constraint | JPA Field | Description |
|---|---|---|---|---|
| `user_id` | BIGINT | **PK**, AUTO_INCREMENT | `userId` (Long) | Unique user identifier |
| `user_name` | VARCHAR(100) | NOT NULL | `name` (String) | Full name |
| `user_email` | VARCHAR(150) | NOT NULL | `email` (String) | Email (used as username) |
| `user_password` | VARCHAR(255) | NOT NULL | `password` (String) | BCrypt hash |
| `mobile_no` | VARCHAR(15) | NOT NULL | `mobile` (String) | Phone number |
| `user_address` | TEXT | NOT NULL | `address` (String) | Delivery address |
| `role` | ENUM | NOT NULL | `role` (Role enum) | SELLER / BUYER / ADMIN |

---

### Table: `products`

| Column | Type | Constraint | JPA Field | Description |
|---|---|---|---|---|
| `product_id` | BIGINT | **PK**, AUTO_INCREMENT | `productId` (Long) | Unique product identifier |
| `product_name` | VARCHAR(200) | NOT NULL | `productName` (String) | Craft product name |
| `description` | TEXT | NOT NULL | `description` (String) | Product description |
| `price` | DOUBLE | NOT NULL | `price` (double) | Listing price |
| `image_URL` | VARCHAR(500) | NOT NULL | `imageUrl` (String) | URL to product image |
| `category` | ENUM | NOT NULL | `category` (Category enum) | HANDMADE_JEWELRY, HOME_DECOR, POTTERY, PAPER_CRAFT, PAINTINGS, FASHION_ACCESSORIES |
| `seller_id` | BIGINT | **FK** → users.user_id | `seller` (User) | Product owner |

---

### Table: `orders`

| Column | Type | Constraint | JPA Field | Description |
|---|---|---|---|---|
| `order_id` | BIGINT | **PK**, AUTO_INCREMENT | `orderId` (Long) | Unique order identifier |
| `order_date` | DATE | NOT NULL | `orderDate` (LocalDate) | Date order was placed |
| `status` | ENUM | NOT NULL | `status` (OrderStatus) | PLACED / CANCELLED / COMPLETED / DELIVERED |
| `total_amount` | DOUBLE | NOT NULL | `totalAmount` (double) | Total order value |
| `buyer_id` | BIGINT | **FK** → users.user_id | `buyer` (User) | The buying user |

*One-to-Many: `orders.order_id` ← `orderItems.order_id`*

---

### Table: `orderItems`

| Column | Type | Constraint | JPA Field | Description |
|---|---|---|---|---|
| `order_item_id` | BIGINT | **PK**, AUTO_INCREMENT | `orderItemId` (Long) | Unique line-item identifier |
| `quantity` | INT | NOT NULL | `quantity` (int) | Number of units ordered |
| `price` | DOUBLE | NOT NULL | `price` (double) | Unit price **at time of order** |
| `product_id` | BIGINT | **FK** → products.product_id | `product` (Product) | Which product |
| `order_id` | BIGINT | **FK** → orders.order_id | `order` (Order) | Which order |

> **Design Decision**: `price` is stored in `orderItems`, not joined from `products.price`.
> This is because the product price can change after an order is placed — storing it in the line item preserves the historical price at the time of purchase.

---

### Table: `payment`

| Column | Type | Constraint | JPA Field | Description |
|---|---|---|---|---|
| `payment_id` | BIGINT | **PK**, AUTO_INCREMENT | `paymentId` (Long) | Unique payment identifier |
| `amount` | DOUBLE | NOT NULL | `amount` (double) | Amount paid |
| `payment_status` | ENUM | — | `paymentStatus` (PaymentStatus) | e.g. PENDING / SUCCESS / FAILED |
| `transaction_id` | VARCHAR(100) | UNIQUE | `transactionId` (String) | Gateway transaction reference |
| `payment_date` | DATETIME | — | `paymentDate` (LocalDateTime) | Exact payment timestamp |
| `order_id` | BIGINT | **FK** → orders.order_id (1:1) | `order` (Order) | Linked order |
| `seller_id` | BIGINT | **FK** → users.user_id | `seller` (User) | Seller receiving payment |

---

## SECTION 3 — DDL (CREATE TABLE)

```sql
-- Run in this order (parent tables first)

CREATE TABLE users (
    user_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_name     VARCHAR(100)  NOT NULL,
    user_email    VARCHAR(150)  NOT NULL,
    user_password VARCHAR(255)  NOT NULL,
    mobile_no     VARCHAR(15)   NOT NULL,
    user_address  TEXT          NOT NULL,
    role          ENUM('SELLER','BUYER','ADMIN') NOT NULL
);

CREATE TABLE products (
    product_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(200)  NOT NULL,
    description  TEXT          NOT NULL,
    price        DOUBLE        NOT NULL,
    image_URL    VARCHAR(500)  NOT NULL,
    category     ENUM('HANDMADE_JEWELRY','HOME_DECOR','POTTERY',
                      'PAPER_CRAFT','PAINTINGS','FASHION_ACCESSORIES') NOT NULL,
    seller_id    BIGINT,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE orders (
    order_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_date   DATE    NOT NULL,
    status       ENUM('PLACED','CANCELLED','COMPLETED','DELIVERED') NOT NULL DEFAULT 'PLACED',
    total_amount DOUBLE  NOT NULL,
    buyer_id     BIGINT,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE orderItems (
    order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity      INT    NOT NULL,
    price         DOUBLE NOT NULL,
    product_id    BIGINT NOT NULL,
    order_id      BIGINT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id)   REFERENCES orders(order_id)   ON DELETE CASCADE
);

CREATE TABLE payment (
    payment_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount         DOUBLE       NOT NULL,
    payment_status VARCHAR(50),
    transaction_id VARCHAR(100) UNIQUE,
    payment_date   DATETIME,
    order_id       BIGINT UNIQUE,
    seller_id      BIGINT,
    FOREIGN KEY (order_id)  REFERENCES orders(order_id)  ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(user_id)    ON DELETE SET NULL
);

-- Recommended Indexes for performance
CREATE INDEX idx_users_email    ON users(user_email);
CREATE INDEX idx_orders_buyer   ON orders(buyer_id);
CREATE INDEX idx_orders_status  ON orders(status);
CREATE INDEX idx_products_cat   ON products(category);
CREATE INDEX idx_payment_order  ON payment(order_id);
```

---

## SECTION 4 — DML INSERT Examples

```sql
-- Insert a new BUYER
INSERT INTO users (user_name, user_email, user_password, mobile_no, user_address, role)
VALUES ('Priya Sharma', 'priya@email.com', '$2a$10$hashedpassword...', '9876543210', 'Pune, MH', 'BUYER');

-- Insert a SELLER
INSERT INTO users (user_name, user_email, user_password, mobile_no, user_address, role)
VALUES ('Anita Craft', 'anita@craftstore.com', '$2a$10$hashedpassword...', '9999988888', 'Mumbai, MH', 'SELLER');

-- Insert a Product (seller_id = 2)
INSERT INTO products (product_name, description, price, image_URL, category, seller_id)
VALUES ('Handmade Silver Ring', 'Sterling silver ring with floral design', 750.00,
        'https://example.com/ring.jpg', 'HANDMADE_JEWELRY', 2);

-- Insert an Order (buyer_id = 1)
INSERT INTO orders (order_date, status, total_amount, buyer_id)
VALUES (CURDATE(), 'PLACED', 750.00, 1);

-- Insert an OrderItem (order_id = 1, product_id = 1)
INSERT INTO orderItems (quantity, price, product_id, order_id)
VALUES (1, 750.00, 1, 1);

-- Insert a Payment
INSERT INTO payment (amount, payment_status, transaction_id, payment_date, order_id, seller_id)
VALUES (750.00, 'SUCCESS', 'TXN-20260227-001', NOW(), 1, 2);
```

---

## SECTION 5 — DML UPDATE Operations

```sql
-- Cancel an order
UPDATE orders SET status = 'CANCELLED' WHERE order_id = 101;

-- Mark order as delivered
UPDATE orders SET status = 'DELIVERED' WHERE order_id = 101;

-- Mark order as completed
UPDATE orders SET status = 'COMPLETED' WHERE order_id = 101;

-- Update product price
UPDATE products SET price = 850.00 WHERE product_id = 1;

-- Update product description
UPDATE products
SET description = 'Updated description for ring', price = 900.00
WHERE product_id = 1;

-- Update payment status (e.g. after gateway response)
UPDATE payment SET payment_status = 'SUCCESS', transaction_id = 'TXN-999'
WHERE order_id = 101;
```

---

## SECTION 6 — DML DELETE Operations

```sql
-- Delete a user (CASCADE deletes their orders too)
DELETE FROM users WHERE user_id = 1;
-- ON DELETE CASCADE on orders.buyer_id → orders deleted too
-- ON DELETE CASCADE on orderItems.order_id → orderItems deleted too

-- Delete a product
DELETE FROM products WHERE product_id = 1;
-- products.seller_id ON DELETE SET NULL → seller is nulled if seller deleted
-- orderItems.product_id ON DELETE CASCADE → line items deleted

-- Delete an order (CASCADE deletes order items)
DELETE FROM orders WHERE order_id = 101;
```

---

## SECTION 7 — SELECT Queries

```sql
-- LOGIN: find user by email (used by UserRepository.findByEmail())
SELECT * FROM users WHERE user_email = 'priya@email.com';

-- CHECK DUPLICATE EMAIL (used by UserRepository.existsByEmail())
SELECT COUNT(*) FROM users WHERE user_email = 'priya@email.com';

-- GET ALL ORDERS for a buyer with product name and order details
SELECT o.order_id, o.order_date, o.status, o.total_amount,
       u.user_name AS buyer_name,
       oi.quantity, oi.price AS unit_price,
       p.product_name, p.category
FROM orders o
JOIN users u ON o.buyer_id = u.user_id
JOIN orderItems oi ON oi.order_id = o.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.buyer_id = 1
ORDER BY o.order_date DESC;

-- GET ORDER HISTORY (all non-PLACED orders) — equivalent of findByBuyer_UserIdAndStatusNot()
SELECT * FROM orders
WHERE buyer_id = 1 AND status != 'PLACED'
ORDER BY order_date DESC;

-- GET ORDERS BY BUYER — equivalent of findByBuyer_UserId()
SELECT * FROM orders WHERE buyer_id = 1;

-- GET PAYMENTS BY SELLER
SELECT p.*, o.order_date, o.total_amount
FROM payment p
JOIN orders o ON p.order_id = o.order_id
WHERE p.seller_id = 2;

-- ADMIN DASHBOARD: count stats
SELECT
  (SELECT COUNT(*) FROM users)    AS total_users,
  (SELECT COUNT(*) FROM products) AS total_products,
  (SELECT COUNT(*) FROM orders)   AS total_orders,
  (SELECT COUNT(*) FROM payment)  AS total_payments,
  (SELECT COALESCE(SUM(amount),0) FROM payment) AS total_revenue;

-- FILTER products by category
SELECT * FROM products WHERE category = 'HANDMADE_JEWELRY';

-- GET all products by seller
SELECT * FROM products WHERE seller_id = 2;

-- ORDER with full payment info (JOIN)
SELECT o.order_id, o.status, o.total_amount,
       pay.amount, pay.payment_status, pay.transaction_id, pay.payment_date
FROM orders o
LEFT JOIN payment pay ON pay.order_id = o.order_id
WHERE o.order_id = 101;
```

---

## SECTION 8 — Spring Data JPA Methods

```java
// UserRepository
Optional<User> findByEmail(String email);
// → SELECT * FROM users WHERE user_email = ?

boolean existsByEmail(String email);
// → SELECT COUNT(*) FROM users WHERE user_email = ?

// OrderRepository
List<Order> findByBuyer_UserId(Long buyerId);
// → SELECT * FROM orders o JOIN users u ON o.buyer_id = u.user_id WHERE u.user_id = ?

List<Order> findByBuyer_UserIdAndStatusNot(Long buyerId, OrderStatus status);
// → SELECT * FROM orders WHERE buyer_id = ? AND status != ?

// PaymentRepository (infers findAll from JpaRepository)
List<Payment> findAll();           // → SELECT * FROM payment
List<Payment> findBySeller_UserId(Long sellerId); // (if added)

// ProductRepository
List<Product> findAll();           // → SELECT * FROM products
List<Product> findBySeller_UserId(Long sellerId); // (if added)

// JPQL example (if added to OrderRepository)
@Query("SELECT o FROM Order o WHERE o.buyer.userId = :buyerId AND o.status = :status")
List<Order> findByBuyerAndStatus(@Param("buyerId") Long buyerId, @Param("status") OrderStatus status);
```

---

## SECTION 9 — Design Decisions for Interview

| Decision | Reason |
|---|---|
| Single `users` table for all roles | Simpler auth — one `findByEmail()`, no JOIN needed. Role-specific logic in service layer. |
| `price` stored in `orderItems` | Product price can change after order is placed. Storing it here preserves the historical amount the buyer actually paid. |
| `@Transactional` on service methods | Ensures atomic DB operations — if any step fails, all changes roll back. Critical for placeOrder. |
| `ddl-auto: update` (Hibernate) | Auto-creates/updates tables on startup — no manual SQL DDL needed in development. |
| `@JsonIgnoreProperties` on entities | Prevents Jackson from serialising lazy-loaded Hibernate proxies (infinite recursion / LazyInitializationException). |
| JWT claims include `role` | Avoids a DB lookup on every request — role is embedded in the token for stateless auth. |
| BCrypt for passwords | One-way adaptive hash with built-in salt. Resistant to rainbow table and brute-force attacks unlike SHA-256. |
| CORS allows only localhost:5173 | Explicit whitelist prevents cross-origin requests from unknown origins. In production, replace with deployed frontend URL. |
