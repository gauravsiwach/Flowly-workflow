import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Modal({ isOpen, title, onClose, onSubmit, submitLabel = 'Submit', children, modalWidth, contentHeight = null, scrollableContent = false }) {
  const { theme } = useTheme();
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: theme.colors.surface,
        borderRadius: 10,
        minWidth: 340,
        width: modalWidth || 400,
        maxWidth: '96vw',
        padding: 24,
        boxShadow: theme.shadows.large,
        border: `1.5px solid ${theme.colors.border}`,
        position: 'relative',
        color: theme.colors.text.primary,
      }}>
        <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16, color: theme.colors.text.primary }}>{title}</div>
        <div style={scrollableContent ? { height: contentHeight || 500, overflowY: 'auto', marginBottom: 16 } : { marginBottom: 16 }}>
          {children}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button
            onClick={onClose}
            style={{
              background: theme.colors.button.secondary,
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 6,
              padding: '8px 16px',
              fontWeight: 500,
              marginRight: 8,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.target.style.background = theme.colors.button.hover;
              e.target.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.target.style.background = theme.colors.button.secondary;
              e.target.style.color = theme.colors.text.primary;
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            style={{
              background: theme.colors.button.primary,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 16px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.target.style.background = theme.colors.button.hover;
            }}
            onMouseLeave={e => {
              e.target.style.background = theme.colors.button.primary;
            }}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
} 