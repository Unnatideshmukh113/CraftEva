import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  const handleRemove = async () => {
    if (!item || !item.orderItemId) {
      alert('Invalid item. Please refresh the page.');
      return;
    }

    if (!window.confirm('Are you sure you want to remove this item from cart?')) {
      return;
    }

    const result = await removeFromCart(item.orderItemId);
    if (result.success) {
      // Item removed successfully, cart will auto-refresh
    } else {
      alert(result.error || 'Failed to remove item. Please try again.');
      console.error('Remove item failed:', result);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h4>{item.product?.productName || 'Product'}</h4>
        <p>Quantity: {item.quantity}</p>
        <p className="item-price">₹{item.price?.toFixed(2)}</p>
      </div>
      <button onClick={handleRemove} className="remove-btn">
        Remove
      </button>
    </div>
  );
};

export default CartItem;
