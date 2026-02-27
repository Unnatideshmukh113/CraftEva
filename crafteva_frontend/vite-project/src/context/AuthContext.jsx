import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');
    const storedRole = sessionStorage.getItem('role');

    if (storedUser && storedToken && storedRole) {
      setUser({
        ...JSON.parse(storedUser),
        role: storedRole,
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, email: userEmail, role, userId, name } = response.data;

      const userData = {
        userId,
        email: userEmail, // Keep email for fallback/uniqueness
        role,
        name: name || userEmail.split('@')[0], // Use name if available, else part of email
      };

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('role', role);

      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      // Ensure role is sent as string (Spring Boot will deserialize to enum)
      const registrationData = {
        ...userData,
        role: userData.role, // Keep as string "BUYER" or "SELLER"
      };

      console.log('Registering user with data:', registrationData);

      const response = await api.post('/auth/register', registrationData);

      console.log('Registration response:', response.data);

      const { token, email: userEmail, role, userId, name: responseName } = response.data;

      if (!token || !role || !userId) {
        throw new Error('Invalid response from server');
      }

      const newUser = {
        userId,
        email: userEmail,
        role,
        name: responseName || userData.name || userEmail.split('@')[0], // Prioritize response, then input, then email
      };

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(newUser));
      sessionStorage.setItem('role', role);

      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      // Extract error message from various possible locations
      let errorMessage = 'Registration failed';

      if (error.response?.data) {
        // Check for validation errors (Spring Boot format)
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (Array.isArray(error.response.data)) {
          // Handle validation error array
          errorMessage = error.response.data.map(err => err.defaultMessage || err.message).join(', ');
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isBuyer: user?.role === 'BUYER',
    isSeller: user?.role === 'SELLER',
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
