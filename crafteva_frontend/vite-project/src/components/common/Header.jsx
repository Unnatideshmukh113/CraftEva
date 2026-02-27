import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout, isBuyer, isSeller, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/about" className="logo">
          <h1>CraftEVA</h1>
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>

          {isAuthenticated ? (
            <>
              {isBuyer && (
                <>
                  <Link to="/cart">
                    Cart ({getCartItemCount()})
                  </Link>
                  <Link to="/wishlist">Wishlist</Link>
                  <Link to="/orders">Orders</Link>
                  <Link to="/order-history">History</Link>
                </>
              )}
              {isSeller && (
                <Link to="/seller">Dashboard</Link>
              )}
              {isAdmin && (
                <Link to="/admin">Admin</Link>
              )}
              <span className="user-info">Hello, {user?.name || user?.email}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
