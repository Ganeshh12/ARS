// Authentication service for frontend
const API_URL = import.meta.env.VITE_API_BASE_URL;
export const authService = {
  // Get JWT token for API calls
  getToken: () => {
    return localStorage.getItem('access_token') || '';
  },
  
  // Login user and store tokens
  login: async (username, password) => {
    try {
      // Make API call to authenticate user
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid credentials');
      }
      
      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('access_token', data.tokens.access_token);
      localStorage.setItem('refresh_token', data.tokens.refresh_token);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.clear();

      // Optional: clear cache manually
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    // setUser(null);
    // setIsAuthenticated(false);

    // Redirect to login
    navigate('/login', { replace: true });
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('access_token') ? True : False;
  },
  
  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },
  
  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};