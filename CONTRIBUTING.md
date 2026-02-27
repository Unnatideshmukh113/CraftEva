# 🤝 Contributing to CraftEva

Thank you for your interest in contributing to CraftEva! We welcome all kinds of contributions — bug reports, feature suggestions, documentation improvements, and code.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Branch Naming](#branch-naming-conventions)
- [Commit Messages](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CraftEva.git
   cd CraftEva
   ```
3. **Set up** the project following the [README.md](README.md) instructions
4. Create a **new branch** for your work (see branch naming below)

---

## Branch Naming Conventions

| Type | Pattern | Example |
|---|---|---|
| New feature | `feature/description` | `feature/add-product-reviews` |
| Bug fix | `fix/description` | `fix/cart-total-calculation` |
| Documentation | `docs/description` | `docs/update-api-endpoints` |
| Refactor | `refactor/description` | `refactor/auth-service` |
| Hotfix | `hotfix/description` | `hotfix/login-null-pointer` |

---

## Commit Message Guidelines

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <short description>

[Optional body]
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation changes
- `style` — Formatting, no logic change
- `refactor` — Code restructuring
- `test` — Adding or updating tests
- `chore` — Build process, dependency update

**Examples:**
```
feat: add wishlist functionality for customers
fix: resolve JWT token expiry not refreshing
docs: update API endpoint documentation
```

---

## Pull Request Process

1. Ensure your branch is **up to date** with `main`:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
2. Run a **local test** before submitting
3. Submit a PR with a **clear title and description**
4. Fill in the PR template checklist
5. Wait for review — a maintainer will review within a few days
6. Make any requested changes and push updates to the same branch

### PR Checklist
- [ ] Code compiles and runs without errors
- [ ] Backend: tested via Swagger or Postman
- [ ] Frontend: tested in browser
- [ ] No hardcoded secrets or credentials
- [ ] No unnecessary files committed (e.g., `node_modules`, `target/`)
- [ ] Description explains *what* and *why*

---

## Code Standards

### Java (Backend)
- Follow standard Java naming conventions (camelCase for methods/variables, PascalCase for classes)
- Use Lombok annotations (`@Data`, `@Builder`, etc.) to reduce boilerplate
- Add Javadoc comments for public service methods
- Keep controllers thin — business logic belongs in services
- Validate inputs using `@Valid` and constraint annotations

### JavaScript / React (Frontend)
- Use functional components with React hooks (no class components)
- One component per file
- Use `axios` instances from the `api/` folder for HTTP calls
- Keep pages in `pages/`, reusable UI in `components/`
- Use meaningful variable and function names

---

## 🐛 Reporting Bugs

Please open an issue at: [https://github.com/Unnatideshmukh113/CraftEva/issues](https://github.com/Unnatideshmukh113/CraftEva/issues)

Include:
- Steps to reproduce
- Expected vs actual behaviour
- Screenshots (if UI related)
- Environment (OS, browser, Java version, Node version)

---

Thank you for contributing! 🎨
