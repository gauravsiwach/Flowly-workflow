import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Palette, X, Check, Monitor } from 'lucide-react';

const ThemeSelector = () => {
  const { theme, currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const containerStyle = {
    position: 'relative',
  };

  const buttonStyle = {
    padding: '8px 12px',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: 'var(--font-size-base)',
    fontWeight: '500',
    color: theme.colors.text.primary,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '140px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    zIndex: 2000,
    minWidth: '280px',
    maxWidth: '320px',
    maxHeight: '400px',
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginTop: '8px',
    padding: '12px',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #E5E7EB',
  };

  const headerTitleStyle = {
    fontSize: 'var(--font-size-lg)',
    fontWeight: '600',
    color: '#1F2937',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  const themesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    maxHeight: '280px',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '4px',
    justifyContent: 'center',
  };

  const themeCardStyle = (isSelected) => ({
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'center',
    padding: '6px',
  });

  const themePreviewStyle = (themeData, isSelected) => ({
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${themeData.colors.primary} 0%, ${themeData.colors.secondary || themeData.colors.primary} 100%)`,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: isSelected 
      ? '0 8px 24px rgba(0, 0, 0, 0.25)' 
      : '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: isSelected ? `3px solid ${themeData.colors.primary}` : '3px solid transparent',
    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
  });

  const themeNameStyle = (isSelected, themeData) => ({
    fontSize: 'var(--font-size-xs)',
    fontWeight: '500',
    color: isSelected ? themeData.colors.primary : theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: '6px',
    padding: '3px 6px',
    borderRadius: '10px',
    background: isSelected ? `${themeData.colors.primary}20` : 'transparent',
    minWidth: '45px',
  });

  const selectedIndicatorStyle = (themeData) => ({
    position: 'absolute',
    top: '-3px',
    right: '-3px',
    background: '#FFFFFF',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    border: `2px solid ${themeData.colors.primary}`,
  });

  const handleThemeSelect = (themeName) => {
    setTheme(themeName);
    setIsOpen(false);
  };

  const getCurrentThemeDisplayName = () => {
    const currentThemeData = availableThemes.find(t => t.name === currentTheme);
    return currentThemeData ? currentThemeData.displayName : 'Select Theme';
  };

  return (
    <div style={containerStyle} className="theme-selector" ref={dropdownRef}>
      <button
        className="theme-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.target.style.background = theme.colors.border;
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = theme.colors.surface;
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }}
      >
        <Palette size={16} />
        <span style={{ flex: 1, textAlign: 'left' }}>{getCurrentThemeDisplayName()}</span>
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          <div style={headerStyle}>
            <div style={headerTitleStyle}>
              <Monitor size={18} />
              Theme Settings
            </div>
            <button
              style={closeButtonStyle}
              onClick={() => setIsOpen(false)}
              onMouseEnter={(e) => {
                e.target.style.background = '#F3F4F6';
                e.target.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#6B7280';
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={themesGridStyle}>
            {availableThemes.map((themeData) => {
              const isSelected = currentTheme === themeData.name;
              // console.log('Theme data:', {
              //   name: themeData.name,
              //   displayName: themeData.displayName,
              //   primaryColor: themeData.colors.primary,
              //   isSelected
              // });
              return (
                <div
                  key={themeData.name}
                  className="theme-card"
                  style={themeCardStyle(isSelected)}
                  onClick={() => handleThemeSelect(themeData.name)}
                >
                  <div style={themePreviewStyle(themeData, isSelected)}>
                  </div>
                  <div style={themeNameStyle(isSelected, themeData)}>
                    {themeData.displayName}
                  </div>
                  {isSelected && (
                    <div style={selectedIndicatorStyle(themeData)}>
                      <Check size={8} color={themeData.colors.primary} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector; 