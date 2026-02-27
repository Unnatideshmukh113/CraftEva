import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartOrderId, setCartOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, isBuyer } = useAuth();

  // Clean up corrupted cart data on mount
  useEffect(() => {
    const storedOrderId = sessionStorage.getItem('cartOrderId');
    if (storedOrderId) {
      // Check if orderId contains invalid characters (like colons)
      if (storedOrderId.includes(':') || isNaN(parseInt(storedOrderId, 10))) {
        console.warn('Clearing corrupted cart data:', storedOrderId);
        sessionStorage.removeItem('cartOrderId');
        sessionStorage.removeItem('cartItems');
        setCartOrderId(null);
        setCartItems([]);
      }
    }
  }, []);

  // Load cart items from backend if order exists
  useEffect(() => {
    const loadCart = async () => {
      const storedOrderId = sessionStorage.getItem('cartOrderId');
      if (storedOrderId && user && isBuyer) {
        try {
          // Parse and validate orderId - extract only numeric part (handle corrupted data like "10:1")
          const cleanId = storedOrderId.split(':')[0].trim();
          const orderIdNum = parseInt(cleanId, 10);
          if (isNaN(orderIdNum) || orderIdNum <= 0) {
            throw new Error('Invalid order ID in storage');
          }
          
          const response = await api.get(`/order-items/order/${orderIdNum}`);
          if (response.data && Array.isArray(response.data)) {
            setCartItems(response.data);
            setCartOrderId(orderIdNum.toString());
            // Fix corrupted data if needed
            if (storedOrderId !== orderIdNum.toString()) {
              sessionStorage.setItem('cartOrderId', orderIdNum.toString());
            }
          } else {
            // Invalid response, clear cart
            sessionStorage.removeItem('cartItems');
            sessionStorage.removeItem('cartOrderId');
            setCartItems([]);
            setCartOrderId(null);
          }
        } catch (error) {
          // If order doesn't exist or is invalid, clear cart
          console.error('Failed to load cart:', error);
          sessionStorage.removeItem('cartItems');
          sessionStorage.removeItem('cartOrderId');
          setCartItems([]);
          setCartOrderId(null);
        }
      }
    };
    if (user && isBuyer) {
      loadCart();
    } else {
      // Clear cart if user is not a buyer
      setCartItems([]);
      setCartOrderId(null);
    }
  }, [user, isBuyer]);

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      sessionStorage.removeItem('cartItems');
    }
    if (cartOrderId) {
      sessionStorage.setItem('cartOrderId', cartOrderId.toString());
    } else {
      sessionStorage.removeItem('cartOrderId');
    }
  }, [cartItems, cartOrderId]);

  const addToCart = async (productId, quantity = 1) => {
    // Validate user and role
    if (!user) {
      return { success: false, error: 'Please login first' };
    }
    
    if (!isBuyer) {
      return { success: false, error: 'Please login as a buyer to add items to cart' };
    }

    // Validate productId
    if (!productId) {
      return { success: false, error: 'Invalid product ID' };
    }

    setLoading(true);
    try {
      // Parse orderId properly, ensuring it's a valid number
      let orderId = null;
      if (cartOrderId) {
        // Clean the orderId - remove any non-numeric characters
        const cleanId = cartOrderId.toString().split(':')[0].trim();
        const parsed = parseInt(cleanId, 10);
        if (!isNaN(parsed) && parsed > 0) {
          orderId = parsed;
        } else {
          // Invalid orderId in storage, clear it
          setCartOrderId(null);
          sessionStorage.removeItem('cartOrderId');
        }
      }

      // If no order exists, create one first
      if (!orderId) {
        try {
          console.log('Creating new order for buyer:', user.userId);
          const orderResponse = await api.post('/orders/add', {
            buyer: { userId: user.userId },
            totalAmount: 0, // Will be updated as items are added
          });
          
          console.log('Order created:', orderResponse.data);
          
          if (!orderResponse.data || !orderResponse.data.orderId) {
            throw new Error('Failed to create order: Invalid response');
          }
          
          orderId = Number(orderResponse.data.orderId);
          if (isNaN(orderId) || orderId <= 0) {
            throw new Error('Invalid order ID received from server');
          }
          const orderIdStr = orderId.toString();
          setCartOrderId(orderIdStr);
          sessionStorage.setItem('cartOrderId', orderIdStr);
        } catch (orderError) {
          setLoading(false);
          const errorMsg = orderError.response?.data?.message || 
                          orderError.message || 
                          'Failed to create order';
          console.error('Order creation error:', {
            status: orderError.response?.status,
            data: orderError.response?.data,
            message: orderError.message
          });
          return { success: false, error: errorMsg };
        }
      }

      // Add item to the order (cart)
      try {
        // Ensure orderId is a number
        const numericOrderId = Number(orderId);
        const numericProductId = Number(productId);
        const numericQuantity = Number(quantity);
        
        if (isNaN(numericOrderId) || numericOrderId <= 0) {
          throw new Error('Invalid order ID');
        }
        if (isNaN(numericProductId) || numericProductId <= 0) {
          throw new Error('Invalid product ID');
        }
        if (isNaN(numericQuantity) || numericQuantity <= 0) {
          throw new Error('Invalid quantity');
        }
        
        const requestPayload = {
          product: { productId: numericProductId },
          order: { orderId: numericOrderId },
          quantity: numericQuantity,
          price: 0, // Will be set by backend based on product
        };
        
        console.log('Adding product to cart:', { 
          productId: numericProductId, 
          orderId: numericOrderId, 
          quantity: numericQuantity,
          requestPayload,
          user: user.userId
        });
        
        const response = await api.post('/order-items/add', requestPayload);
        
        console.log('Item added to cart successfully:', response.data);
        
        if (!response.data) {
          throw new Error('Invalid response from server');
        }

        // Refresh cart items from backend to get updated totals
        // Ensure orderId is a clean number for the URL - extract only numeric part
        const orderIdStr = numericOrderId.toString().split(':')[0].trim();
        const cleanOrderId = parseInt(orderIdStr, 10);
        if (isNaN(cleanOrderId) || cleanOrderId <= 0) {
          console.error('Invalid order ID:', numericOrderId, '->', cleanOrderId);
          throw new Error('Invalid order ID for fetching cart items');
        }
        
        console.log('Fetching cart items for order:', cleanOrderId);
        const cartResponse = await api.get(`/order-items/order/${cleanOrderId}`);
        
        if (cartResponse.data && Array.isArray(cartResponse.data)) {
          setCartItems(cartResponse.data);
          // Ensure we store the clean orderId
          const orderIdString = cleanOrderId.toString();
          setCartOrderId(orderIdString);
          sessionStorage.setItem('cartOrderId', orderIdString);
          console.log('Cart updated successfully. Items:', cartResponse.data.length);
        } else {
          console.warn('Invalid cart response:', cartResponse.data);
          // Still return success if the item was added, but refresh might have failed
        }
        
        setLoading(false);
        return { success: true, data: response.data };
      } catch (itemError) {
        setLoading(false);
        const errorMsg = itemError.response?.data?.message || 
                        itemError.response?.data?.error ||
                        itemError.message || 
                        'Failed to add item to cart';
        console.error('Add to cart error:', {
          status: itemError.response?.status,
          statusText: itemError.response?.statusText,
          data: itemError.response?.data,
          message: itemError.message,
          request: { productId, orderId, quantity },
          fullError: itemError
        });
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      setLoading(false);
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      'Failed to add to cart';
      console.error('Cart error:', error.response?.data || error);
      return { success: false, error: errorMsg };
    }
  };

  const removeFromCart = async (orderItemId) => {
    if (!orderItemId) {
      return { success: false, error: 'Invalid item ID' };
    }

    setLoading(true);
    try {
      await api.delete(`/order-items/${orderItemId}`);
      
      // Refresh cart from backend to get updated state
      if (cartOrderId) {
        const cleanOrderId = parseInt(cartOrderId.toString().split(':')[0].trim(), 10);
        if (!isNaN(cleanOrderId) && cleanOrderId > 0) {
          try {
            const cartResponse = await api.get(`/order-items/order/${cleanOrderId}`);
            if (cartResponse.data && Array.isArray(cartResponse.data)) {
              setCartItems(cartResponse.data);
              // If cart is empty, clear the order ID
              if (cartResponse.data.length === 0) {
                setCartOrderId(null);
                sessionStorage.removeItem('cartOrderId');
              }
            } else {
              // Fallback: remove from local state
              setCartItems((prev) => {
                const updated = prev.filter((item) => item.orderItemId !== orderItemId);
                if (updated.length === 0) {
                  setCartOrderId(null);
                  sessionStorage.removeItem('cartOrderId');
                }
                return updated;
              });
            }
          } catch (refreshError) {
            console.error('Failed to refresh cart after removal:', refreshError);
            // Fallback: remove from local state
            setCartItems((prev) => {
              const updated = prev.filter((item) => item.orderItemId !== orderItemId);
              if (updated.length === 0) {
                setCartOrderId(null);
                sessionStorage.removeItem('cartOrderId');
              }
              return updated;
            });
          }
        }
      } else {
        // No order ID, just remove from local state
        setCartItems((prev) => prev.filter((item) => item.orderItemId !== orderItemId));
      }
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error('Remove from cart error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to remove item',
      };
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartOrderId(null);
    sessionStorage.removeItem('cartItems');
    sessionStorage.removeItem('cartOrderId');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    cartOrderId,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
