# ⚡ CraftEva Deployment Quickstart

> For full deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 🏃 Local Development (5 Steps)

```bash
# 1. Clone
git clone https://github.com/Unnatideshmukh113/CraftEva.git
cd CraftEva

# 2. Set up database
# Create MySQL DB: crafteva_db
# Edit: crafteva-backend/springboot_backend_template/src/main/resources/application.properties

# 3. Run backend
cd crafteva-backend/springboot_backend_template
./mvnw spring-boot:run
# → Starts at http://localhost:8080
# → Swagger: http://localhost:8080/swagger-ui/index.html

# 4. Run frontend (new terminal)
cd crafteva_frontend/vite-project
npm install && npm run dev
# → Starts at http://localhost:5173

# 5. Open browser at http://localhost:5173 🎉
```

---

## 🔑 Essential Environment Variables

### Backend (`application.properties`)

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/crafteva_db
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
jwt.secret=YOUR_JWT_SECRET_MIN_32_CHARS
jwt.expiration=86400000
```

### Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8080
```

> In production, change `VITE_API_BASE_URL` to your deployed backend URL, e.g.:
> ```env
> VITE_API_BASE_URL=https://crafteva-backend.onrender.com
> ```

---

## 🌐 Production Deployment (Quick)

| Service | Platform | Command / Action |
|---|---|---|
| **Backend** | Render.com | Connect GitHub → Root: `crafteva-backend/springboot_backend_template` → Build: `./mvnw clean package -DskipTests` → Start: `java -jar target/*.jar` |
| **Frontend** | Vercel | Connect GitHub → Root: `crafteva_frontend/vite-project` → Build: `npm run build` → Output: `dist` |
| **Database** | Aiven / Railway | Create MySQL instance → copy connection string to Render env vars |

---

## ✅ Deployment Checklist

- [ ] MySQL database created and accessible from cloud
- [ ] Backend env vars set on Render (DB URL, username, password, JWT secret)
- [ ] Backend deployed and `/actuator/health` returns `{"status":"UP"}`
- [ ] Frontend `VITE_API_BASE_URL` points to production backend URL
- [ ] Frontend deployed and accessible
- [ ] Test login and core user flow end-to-end
