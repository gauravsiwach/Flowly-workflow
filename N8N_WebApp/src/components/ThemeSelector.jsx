import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, ChevronUp, ChevronDown, Check } from 'lucide-react';

const ThemeSelector = () => {
  const { theme, currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const containerStyle = {
    position: 'relative',
  };

  const buttonStyle = {
    padding: '8px 12px',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: 'var(--font-size-base)',
    fontWeight: '500',
    color: theme.colors.text.primary,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    minWidth: '120px',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    boxShadow: theme.shadows.medium,
    zIndex: 2000,
    minWidth: '160px',
    maxHeight: '300px',
    overflowY: 'auto',
    transition: 'all 0.2s ease',
    marginTop: '4px',
  };

  const themeOptionStyle = (isSelected) => ({
    padding: '8px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: isSelected ? theme.colors.primary : 'transparent',
    color: isSelected ? '#FFFFFF' : theme.colors.text.primary,
    transition: 'all 0.2s ease',
    borderBottom: `1px solid ${theme.colors.border}`,
    fontSize: 'var(--font-size-base)',
  });

  const colorPreviewStyle = (themeData) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: themeData.colors.primary,
    border: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
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
    <div style={containerStyle} className="theme-selector">
      <button
        className="theme-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.target.style.background = theme.colors.border;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = theme.colors.surface;
        }}
      >
        <Palette size={16} />
        <span style={{ flex: 1, textAlign: 'left' }}>{getCurrentThemeDisplayName()}</span>
        {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          {availableThemes.map((themeData) => (
            <div
              key={themeData.name}
              className="theme-option"
              style={themeOptionStyle(currentTheme === themeData.name)}
              onClick={() => handleThemeSelect(themeData.name)}
              onMouseEnter={(e) => {
                if (currentTheme !== themeData.name) {
                  e.target.style.background = theme.colors.border;
                }
              }}
              onMouseLeave={(e) => {
                if (currentTheme !== themeData.name) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <div style={colorPreviewStyle(themeData)} />
              <span>{themeData.displayName}</span>
              {currentTheme === themeData.name && (
                <Check size={12} style={{ marginLeft: 'auto' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector; 