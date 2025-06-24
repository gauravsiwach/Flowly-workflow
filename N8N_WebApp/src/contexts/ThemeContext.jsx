import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, defaultTheme } from '../themes';

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

  // Load theme, font size, and grid opacity from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    const savedGridOpacity = localStorage.getItem('gridOpacity') || '90';
    setCurrentTheme(savedTheme);
    setFontSize(savedFontSize);
    setGridOpacity(parseInt(savedGridOpacity));
  }, []);

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

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'light' : 'light'); // Keep it light for testing
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