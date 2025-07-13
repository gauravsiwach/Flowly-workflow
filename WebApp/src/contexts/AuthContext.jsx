import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserProfile } from '../services/authService';

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
        const storedToken = localStorage.getItem('flowly_jwt_token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          const tokenData = jwtDecode(storedToken);
          
          if (tokenData.exp && isTokenExpired(tokenData.exp)) {
            // Token expired, clear user
            setUser(null);
            localStorage.removeItem('flowly_user');
            localStorage.removeItem('flowly_jwt_token');
          } else {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('flowly_user');
        localStorage.removeItem('flowly_jwt_token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login with Google credential
  const loginWithGoogle = async (credentialResponse) => {
    // console.log('Login response:', credentialResponse);
    
    if (credentialResponse && credentialResponse.access_token) {
      try {
        // Send access token to backend for verification
        const backendData = await getUserProfile(credentialResponse.access_token);
        // console.log('Backend user profile response:', backendData);
        
        if (backendData.status === 'success') {
          const userData = {
            ...backendData.user,
            name: backendData.user.name,
            email: backendData.user.email,
            picture: backendData.user.picture,
            sub: backendData.user.id, // Google user ID
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
            email_verified: backendData.user.email_verified,
            access_token: credentialResponse.access_token,
            is_new_user: backendData.is_new_user || false,
            openai_key_saved: backendData.openai_key_saved,
          };
          
          // Save user data and JWT token
          setUser(userData);
          localStorage.setItem('flowly_user', JSON.stringify(userData));
          localStorage.setItem('flowly_jwt_token', backendData.jwt_token);
          // console.log(`User logged in via backend with JWT token: ${backendData.is_new_user ? 'NEW USER' : 'EXISTING USER'}`, userData);
        } else {
          throw new Error('Backend user profile request failed');
        }
      } catch (error) {
        console.error('Error with backend user profile request:', error);
        // Fallback to frontend-only authentication
        try {
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
          // console.log('User logged in (fallback):', userData);
        } catch (fallbackError) {
          console.error('Error in fallback authentication:', fallbackError);
          alert('Error processing login response. Please try again.');
        }
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
          access_token: credentialResponse.access_token,
          ...decoded
        };
        
        setUser(userData);
        localStorage.setItem('flowly_user', JSON.stringify(userData));
        // console.log('User logged in:', userData);
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
    localStorage.removeItem('flowly_jwt_token');
    // console.log('User logged out');
  };

  // Get JWT token for API calls
  const getJwtToken = () => {
    return localStorage.getItem('flowly_jwt_token');
  };

  // Refresh user profile from backend (after saving OpenAI key, etc)
  const refreshUserProfile = async () => {
    try {
      const storedUser = localStorage.getItem('flowly_user');
      const storedToken = localStorage.getItem('flowly_jwt_token');
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        // Use the access_token from userData to re-fetch profile
        if (userData.access_token) {
          const backendData = await getUserProfile(userData.access_token);
          if (backendData.status === 'success') {
            const updatedUser = {
              ...userData,
              ...backendData.user,
              openai_key_saved: backendData.openai_key_saved,
              is_new_user: backendData.is_new_user || false,
            };
            setUser(updatedUser);
            localStorage.setItem('flowly_user', JSON.stringify(updatedUser));
            // Optionally update JWT if it changed
            if (backendData.jwt_token) {
              localStorage.setItem('flowly_jwt_token', backendData.jwt_token);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  const value = {
    user,
    isLoading,
    loginWithGoogle,
    logout,
    getJwtToken,
    isAuthenticated: !!user,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 