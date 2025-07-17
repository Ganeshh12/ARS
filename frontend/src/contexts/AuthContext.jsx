import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth-service';

// Redirect helper based on user role
export const getRedirectPath = (user) => {
  if (!user) return '/login';
  
  switch (user.role) {
    case 'admin':
      return '/admin/dashboard';
    case 'faculty':
      return '/faculty/dashboard';
    case 'hod':
      return '/hod/dashboard';
    case 'principal':
      return '/principal/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/login';
  }
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('access_token');
      
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          localStorage.clear();
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    const result = await authService.login(username, password);
    
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      return { success: true, user: result.user };
    } else {
      return { success: false, error: result.error };
    }
  };

  const logout = () => {
    localStorage.clear()
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const refreshToken = async () => {
    const result = await authService.refreshToken();
    if (!result.success) {
      localStorage.clear();
      logout();
    }
    return result.success;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAuthenticated,
        login, 
        logout, 
        isAdmin, 
        hasRole,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;