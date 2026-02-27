# CraftEva Frontend — React Concepts Dictionary

> All code examples use patterns from the actual CraftEva frontend (React 19 + Vite + Axios + React Router v6 + Context API).

---

## SECTION 1 — React Core Concepts

### JSX (JavaScript XML)
JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. It gets compiled to `React.createElement()` calls by Babel/Vite.
```jsx
// JSX
const element = <h1 className="title">CraftEva</h1>;
// Compiled to:
const element = React.createElement('h1', { className: 'title' }, 'CraftEva');
```

### Virtual DOM
React maintains an in-memory copy of the real DOM. When state changes, React diffs the new Virtual DOM against the old one (reconciliation) and only updates the real DOM where changes occurred — making UI updates fast.

### Reconciliation
The process React uses to determine what changed and what DOM updates to make. React uses a "diffing" algorithm — it compares the same position element type first, then keys in lists.

### Keys in Lists
Keys help React identify which list items changed, were added, or removed. Keys must be stable, unique, and not index-based when the list can reorder.
```jsx
{products.map(product => (
  <ProductCard key={product.productId} product={product} />
))}
```

### Props vs State
| Aspect | Props | State |
|---|---|---|
| Direction | Parent → Child | Internal to component |
| Mutable? | Read-only (immutable) | Mutable via `setState` / `useState` setter |
| Triggers re-render | Yes (when parent re-renders) | Yes (via setter) |
| Example | `<Cart items={cartItems} />` | `const [items, setItems] = useState([])` |

---

## SECTION 2 — All React Hooks

### `useState`
Declares state inside a functional component. Returns `[value, setter]`. The setter triggers a re-render.
```jsx
const [cartItems, setCartItems] = useState([]);
const addToCart = (product) => setCartItems(prev => [...prev, product]);
```

### `useEffect`
Runs side effects (API calls, event listeners, subscriptions) after render. Dependencies array controls when it re-runs.
```jsx
// Fetch products on mount
useEffect(() => {
  axios.get('/api/products').then(res => setProducts(res.data));
}, []); // empty array = run once on mount only

// Re-run when buyerId changes
useEffect(() => {
  axios.get(`/api/orders/buyer/${buyerId}`).then(res => setOrders(res.data));
}, [buyerId]);
```

### `useContext`
Reads a context value without prop drilling. Used in CraftEva to access `AuthContext` anywhere in the tree.
```jsx
const { token, role, userId, login, logout } = useContext(AuthContext);
```

### `useRef`
Creates a mutable ref object that persists between renders without causing re-renders. Used for:
- Accessing DOM elements directly
- Storing previous values or interval IDs
```jsx
const inputRef = useRef(null);
inputRef.current.focus(); // focus input programmatically
```

### `useMemo`
Caches the result of an expensive computation. Only recalculates when dependencies change.
```jsx
const totalAmount = useMemo(() => {
  return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
}, [cartItems]);
```

### `useCallback`
Caches a function definition between renders. Prevents child components wrapped in `React.memo` from re-rendering when the parent re-renders.
```jsx
const handleAddToCart = useCallback((product) => {
  setCartItems(prev => [...prev, product]);
}, []); // function reference stable across renders
```

### `useReducer`
Alternative to `useState` for complex state with multiple sub-values or when next state depends on previous.
```jsx
const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
dispatch({ type: 'ADD_ITEM', payload: product });
```

### `useNavigate` (React Router)
Programmatic navigation — used after login/logout/order placement.
```jsx
const navigate = useNavigate();
const handleLogin = async () => {
  const res = await axiosInstance.post('/api/auth/login', { email, password });
  login(res.data.token, res.data.role, res.data.userId);
  navigate('/'); // redirect to home after login
};
```

### `useParams` (React Router)
Reads URL path parameters.
```jsx
// Route: /orders/:orderId
const { orderId } = useParams();
useEffect(() => {
  axios.get(`/api/orders/${orderId}`).then(res => setOrder(res.data));
}, [orderId]);
```

---

## SECTION 3 — Component Lifecycle (mapped to Hooks)

| Lifecycle Event | Class Component | Hook Equivalent |
|---|---|---|
| Component mounts | `componentDidMount()` | `useEffect(() => {...}, [])` |
| State/props update | `componentDidUpdate(prevProps, prevState)` | `useEffect(() => {...}, [dep])` |
| Component unmounts | `componentWillUnmount()` | `useEffect(() => { return () => cleanup(); }, [])` |
| Render | `render()` | The function body / `return (...)` |
| Error handling | `componentDidCatch()` | `ErrorBoundary` class or `react-error-boundary` library |

---

## SECTION 4 — Context API (used in CraftEva)

### AuthContext Pattern

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole]   = useState(localStorage.getItem('role'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const login = (newToken, newRole, newUserId) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('userId', newUserId);
    setToken(newToken);
    setRole(newRole);
    setUserId(newUserId);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for clean access
export const useAuth = () => useContext(AuthContext);
```

```jsx
// Usage in any component
const { token, role, userId, logout } = useAuth();
```

### When to Use Context vs State
| Use | Context API | useState |
|---|---|---|
| Auth state (token, role) | ✅ Needed globally | ❌ Too many prop passes |
| Cart items | ✅ Shared across pages | ❌ Hard to share |
| Single form field | ❌ Overkill | ✅ Local state |
| Fetched list (products) | ✅ If shared | ✅ Local if component-only |

---

## SECTION 5 — React Router v6

### Route Setup
```jsx
// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/"             element={<Home />} />
      <Route path="/login"        element={<Login />} />
      <Route path="/register"     element={<Register />} />
      <Route path="/cart"         element={<PrivateRoute role="BUYER"><Cart /></PrivateRoute>} />
      <Route path="/orders"       element={<PrivateRoute role="BUYER"><Orders /></PrivateRoute>} />
      <Route path="/seller"       element={<PrivateRoute role="SELLER"><SellerDashboard /></PrivateRoute>} />
      <Route path="/admin"        element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
      <Route path="*"             element={<Navigate to="/" />} />
    </Routes>
  );
}
```

### PrivateRoute Pattern
```jsx
// src/auth/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;

  return children;
};
export default PrivateRoute;
```

| Hook / Component | Purpose |
|---|---|
| `<Routes>` | Container for all `<Route>` elements |
| `<Route path="/x" element={<X/>}>` | Defines a route |
| `<Link to="/x">` | Declarative navigation link |
| `useNavigate()` | Programmatic navigation |
| `useParams()` | Read `:id` from URL |
| `useSearchParams()` | Read `?query=value` from URL |
| `<Navigate to="/x">` | Redirect component |

---

## SECTION 6 — Axios Instance with Interceptors

```jsx
// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

// REQUEST INTERCEPTOR — attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR — handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login'; // hard redirect
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

**Why interceptors?**
- Without interceptors, you'd manually add `Authorization: Bearer token` in every API call
- The response interceptor catches ALL 401 errors globally so the user is redirected to login if their token expires — no per-component handling needed

---

## SECTION 7 — Advanced Patterns

### Higher-Order Component (HOC)
A function that takes a component and returns a new enhanced component. Used for cross-cutting concerns (auth, logging, analytics).
```jsx
// HOC example: withAuth
const withAuth = (WrappedComponent) => {
  return (props) => {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login" />;
    return <WrappedComponent {...props} />;
  };
};
```

### React.memo
Prevents a component from re-rendering if its props haven't changed.
```jsx
const ProductCard = React.memo(({ product }) => {
  return <div>{product.productName}</div>;
});
```

### lazy + Suspense (Code Splitting)
Loads a component only when it's needed (on-demand) — reduces initial bundle size.
```jsx
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
<Suspense fallback={<div>Loading...</div>}>
  <AdminDashboard />
</Suspense>
```

---

## SECTION 8 — Performance Patterns

| Pattern | Tool | When |
|---|---|---|
| Skip re-render if props same | `React.memo` | Expensive child components |
| Cache a computed value | `useMemo` | Heavy calculation (cart total) |
| Stable function reference | `useCallback` | Passing callbacks to memoized children |
| Code split by route | `lazy()` + `Suspense` | Large page components |
| Avoid unnecessary state | Derive from existing state | Calculate total from items, not store separately |

---

## SECTION 9 — Quick Reference Tables

### All Hooks Cheat Sheet

| Hook | Returns | Typical Use |
|---|---|---|
| `useState(init)` | `[value, setter]` | Local state |
| `useEffect(fn, deps)` | void | Side effects, API calls |
| `useContext(Context)` | context value | Auth, theme, cart |
| `useRef(init)` | `{current: value}` | DOM access, timers |
| `useMemo(fn, deps)` | cached value | Expensive computation |
| `useCallback(fn, deps)` | cached function | Stable callback for child |
| `useReducer(reducer, init)` | `[state, dispatch]` | Complex state |
| `useNavigate()` | navigate function | Redirect after action |
| `useParams()` | params object | URL path params |
| `useSearchParams()` | `[searchParams, setSearchParams]` | URL query params |

### useState vs useReducer

| Situation | Use |
|---|---|
| Simple on/off toggle | `useState` |
| Single counter | `useState` |
| Multiple related values (cart: items + total + discount) | `useReducer` |
| Next state depends on previous in complex ways | `useReducer` |
| Complex actions that change multiple state slices | `useReducer` |

### Context API vs Redux (not used in CraftEva — Context used)

| Feature | Context API | Redux Toolkit |
|---|---|---|
| Setup complexity | Low | Medium |
| Performance (frequent updates) | Can cause re-renders | Optimized with selectors |
| DevTools | None built-in | Redux DevTools Extension |
| Good for | Auth, theme, low-frequency updates | Large apps with frequent global state |
| CraftEva uses | ✅ Context API | — |

### Class Lifecycle vs Hook Equivalent

| Class | Hook | Notes |
|---|---|---|
| `componentDidMount` | `useEffect(() => {...}, [])` | Empty deps = mount only |
| `componentDidUpdate` | `useEffect(() => {...}, [dep])` | Runs when dep changes |
| `componentWillUnmount` | `return () => cleanup()` inside useEffect | Cleanup function |
| `shouldComponentUpdate` | `React.memo` + `useMemo` | Skip re-render |
| `getDerivedStateFromProps` | Compute in render body | Derive state from props |

---

## SECTION 10 — Interview Questions & Model Answers

**Q: How does React know when to re-render?**
A: React re-renders a component when its state changes (via useState setter) or when its props change (because the parent re-rendered). React.memo wraps a component to skip re-renders if props are shallowly equal.

**Q: Why is the key prop important in lists?**
A: Keys help React identify which items in a list were added, removed, or moved during reconciliation. Without stable keys, React may incorrectly reuse DOM nodes, causing bugs like wrong data in inputs.

**Q: Explain useEffect cleanup.**
A: The function returned from useEffect runs before the next effect runs and when the component unmounts. Used to unsubscribe from events, clear intervals, or cancel pending requests — preventing memory leaks.

**Q: Why use Axios interceptors instead of adding the token in each call?**
A: Interceptors centralise the auth header injection and 401 handling. Without it, you'd repeat `headers: { Authorization: Bearer ${token} }` in every API call, and handle session expiry in every component — violating DRY.

**Q: What is the Virtual DOM and why does it help performance?**
A: The Virtual DOM is an in-memory JS representation of the real DOM. When state changes, React diffs the new Virtual DOM against the previous one (reconciliation), computes the minimal set of changes, and batches them into a single real DOM update — much faster than directly manipulating the DOM on every state change.

**Q: What is shallow comparison in React.memo?**
A: React.memo does a shallow comparison of props — it checks if each prop reference is the same (`===`). Objects and arrays created inline `{}` or `[]` always fail this check (new reference each render). Use useMemo to stabilise objects passed as props.
