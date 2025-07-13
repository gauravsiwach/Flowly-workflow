import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { themes, defaultTheme } from '../themes';
import { getUserTheme, saveUserTheme } from '../services/themeService';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('medium');
  const [gridOpacity, setGridOpacity] = useState(90);
  const { user, isAuthenticated } = useAuth ? useAuth() : { user: null, isAuthenticated: false };
  const prevUserRef = useRef(null);

  // Load theme, font size, and grid opacity from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    const savedGridOpacity = localStorage.getItem('gridOpacity') || '90';
    setCurrentTheme(savedTheme);
    setFontSize(savedFontSize);
    setGridOpacity(parseInt(savedGridOpacity));
  }, []);

  // On login, fetch and apply user's theme from backend
  useEffect(() => {
    // Only run if user just logged in (user changed from null to object)
    if (isAuthenticated && user && prevUserRef.current !== user) {
      getUserTheme()
        .then(theme => {
          if (theme && themes[theme]) {
            setCurrentTheme(theme);
          }
        })
        .catch(() => {});
    }
    prevUserRef.current = user;
  }, [user, isAuthenticated]);

  // Save theme, font size, and grid opacity to localStorage when they change
  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('gridOpacity', gridOpacity.toString());
    // Apply theme to document body for global styles
    document.body.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-font-size', fontSize);
    document.body.setAttribute('data-grid-opacity', gridOpacity.toString());
  }, [currentTheme, fontSize, gridOpacity]);

  // On theme change, save to backend if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      saveUserTheme(currentTheme).catch(() => {});
    }
  }, [currentTheme, isAuthenticated, user]);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const setFontSizeValue = (size) => {
    setFontSize(size);
  };

  const setGridOpacityValue = (opacity) => {
    setGridOpacity(opacity);
  };

  const value = {
    theme: themes[currentTheme] || defaultTheme,
    currentTheme,
    fontSize,
    gridOpacity,
    setTheme,
    setFontSize: setFontSizeValue,
    setGridOpacity: setGridOpacityValue,
    toggleTheme,
    themes,
    availableThemes: Object.values(themes)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 