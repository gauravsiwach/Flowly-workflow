import React, { useState } from 'react';
import { FileText, X, Copy, Check, Eye } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ResultPanel({ 
  selectedNode, 
  onClose 
}) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!selectedNode) {
    return null;
  }

  const panelStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '400px',
    height: '100vh',
    background: theme.colors.surface,
    borderLeft: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.large,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
    minHeight: '50px',
  };

  const titleStyle = {
    fontSize: 'var(--font-size-sm)',
    fontWeight: '600',
    color: theme.colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  const contentStyle = {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    background: theme.colors.background,
  };

  const resultStyle = {
    fontSize: 'var(--font-size-sm)',
    lineHeight: '1.5',
    color: theme.colors.text.primary,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '16px',
    minHeight: '200px',
    maxHeight: '400px',
    overflowY: 'auto',
  };

  const buttonStyle = {
    background: theme.colors.button.primary,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: 'var(--font-size-sm)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    width: '100%',
    justifyContent: 'center',
  };

  const nodeInfoStyle = {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '16px',
  };

  const infoLabelStyle = {
    fontSize: 'var(--font-size-xs)',
    color: theme.colors.text.secondary,
    marginBottom: '4px',
  };

  const infoValueStyle = {
    fontSize: 'var(--font-size-sm)',
    color: theme.colors.text.primary,
    fontWeight: '500',
  };

  const handleClose = () => {
    onClose();
    setCopied(false);
  };

  const handleCopyResult = async () => {
    if (!selectedNode?.data?.node_result) return;
    
    try {
      await navigator.clipboard.writeText(selectedNode.data.node_result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const nodeData = selectedNode.data;
  const result = nodeData.node_result;

  // Check if this is HTML content (from Convert to HTML Template node)
  const isHtmlContent = nodeData.title === 'Convert_to_HTML_Template' && 
                       typeof result === 'string' && 
                       result.includes('<html') && 
                       result.includes('</html>');

  // Create a safe HTML renderer
  const renderContent = () => {
    if (isHtmlContent) {
      return (
        <div 
          style={{
            ...resultStyle,
            padding: '0',
            overflow: 'hidden',
            border: 'none',
            background: 'white'
          }}
        >
          <iframe
            srcDoc={result}
            style={{
              width: '100%',
              height: '400px',
              border: 'none',
              borderRadius: '6px'
            }}
            title="HTML Preview"
            sandbox="allow-same-origin"
          />
        </div>
      );
    } else {
      return (
        <div style={resultStyle}>
          {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
        </div>
      );
    }
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>
          <FileText size={16} style={{ color: theme.colors.text.secondary }} />
          {nodeData.title?.replace(/_/g, ' ')} - Result
        </div>
        <button 
          style={closeButtonStyle} 
          onClick={handleClose}
          onMouseEnter={(e) => {
            e.target.style.background = theme.colors.button.hover;
            e.target.style.color = theme.colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = theme.colors.text.secondary;
          }}
        >
          <X size={18} />
        </button>
      </div>
      
      <div style={contentStyle}>
        {/* Node Information */}
        <div style={nodeInfoStyle}>
          <div style={infoLabelStyle}>Node ID</div>
          <div style={infoValueStyle}>{selectedNode.id}</div>
          {nodeData.label && (
            <>
              <div style={infoLabelStyle}>Label</div>
              <div style={infoValueStyle}>{nodeData.label}</div>
            </>
          )}
          {nodeData.description && (
            <>
              <div style={infoLabelStyle}>Description</div>
              <div style={infoValueStyle}>{nodeData.description}</div>
            </>
          )}
          {nodeData.additional_input?.[nodeData.title] && (
            <>
              <div style={infoLabelStyle}>Input</div>
              <div style={infoValueStyle}>{nodeData.additional_input[nodeData.title]}</div>
            </>
          )}
        </div>

        {/* Result Display */}
        {result ? (
          <>
            {renderContent()}
            
            <button 
              style={buttonStyle}
              onClick={handleCopyResult}
              onMouseEnter={(e) => {
                e.target.style.background = theme.colors.button.hover;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = theme.colors.button.primary;
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </>
        ) : (
          <div style={{
            ...resultStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.text.secondary,
            fontStyle: 'italic',
          }}>
            No result available
          </div>
        )}
      </div>
    </div>
  );
} 