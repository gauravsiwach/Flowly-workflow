import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

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
  const [isLoading, setIsLoading] = useState(true);

  // Check if token is expired
  const isTokenExpired = (exp) => {
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('flowly_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.exp && isTokenExpired(userData.exp)) {
            // Token expired, clear user
            setUser(null);
            localStorage.removeItem('flowly_user');
          } else {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('flowly_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login with Google credential
  const loginWithGoogle = async (credentialResponse) => {
    console.log('Login response:', credentialResponse);
    
    if (credentialResponse && credentialResponse.access_token) {
      try {
        // Fetch user info using the access token
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${credentialResponse.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        
        const userInfo = await response.json();
        const userData = {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          sub: userInfo.id, // Google user ID
          exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
          email_verified: userInfo.verified_email,
          access_token: credentialResponse.access_token,
          ...userInfo
        };
        
        setUser(userData);
        localStorage.setItem('flowly_user', JSON.stringify(userData));
        console.log('User logged in:', userData);
      } catch (error) {
        console.error('Error fetching user info:', error);
        alert('Error processing login response. Please try again.');
      }
    } else if (credentialResponse && credentialResponse.credential) {
      // Handle JWT credential (fallback for other flows)
      try {
        const decoded = jwtDecode(credentialResponse.credential);
        const userData = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
          sub: decoded.sub, // Google user ID
          exp: decoded.exp,
          email_verified: decoded.email_verified,
          ...decoded
        };
        
        setUser(userData);
        localStorage.setItem('flowly_user', JSON.stringify(userData));
        console.log('User logged in:', userData);
      } catch (error) {
        console.error('Error decoding JWT:', error);
        alert('Error processing login response. Please try again.');
      }
    } else {
      console.error('Invalid credential response:', credentialResponse);
      alert('Login failed. Please try again.');
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('flowly_user');
    console.log('User logged out');
  };

  const value = {
    user,
    isLoading,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 