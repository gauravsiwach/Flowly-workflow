import React, { useState } from 'react';
import { FileText, X, Copy, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ResultPopup({ 
  isOpen, 
  onClose, 
  title, 
  result, 
  nodeId 
}) {
  const { theme, fontSize } = useTheme();
  const [copied, setCopied] = useState(false);

  const popupOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  };

  const popupStyle = {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    padding: '8px',
    width: '600px',
    height: '300px',
    boxShadow: theme.shadows.large,
    position: 'relative',
  };

  const popupHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 4px',
    borderBottom: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
    borderRadius: '6px 6px 0 0',
    minHeight: '25px',
    maxHeight: '30px',
  };

  const popupTitleStyle = {
    fontSize: 'var(--font-size-xs)',
    fontWeight: '500',
    color: theme.colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const popupContentStyle = {
    fontSize: 'var(--font-size-xs)',
    lineHeight: '1.4',
    color: theme.colors.text.primary,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    height: '200px',
    overflowY: 'auto',
    padding: '10px',
    background: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '4px',
    marginTop: '10px',
  };

  const popupButtonStyle = {
    background: theme.colors.button.primary,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: 'var(--font-size-xs)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    transition: 'all 0.2s ease',
  };

  const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    padding: '3px',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const handleClosePopup = () => {
    onClose();
    setCopied(false);
  };

  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={popupOverlayStyle} onClick={handleClosePopup}>
      <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
        <div style={popupHeaderStyle}>
          <div style={popupTitleStyle}>
            <FileText size={10} style={{ color: theme.colors.text.secondary }} />
            {title} - Result
          </div>
          <button style={closeButtonStyle} onClick={handleClosePopup}>
            <X size={12} />
          </button>
        </div>
        <div style={popupContentStyle}>
          {result}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', gap: '6px' }}>
          <button 
            style={popupButtonStyle}
            onClick={handleCopyResult}
            onMouseEnter={(e) => {
              e.target.style.background = theme.colors.button.hover;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = theme.colors.button.primary;
            }}
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
        </div>
      </div>
    </div>
  );
} 