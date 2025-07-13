import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { useTheme } from '../../contexts/ThemeContext';
import { validateNodeInput, getValidationRules } from '../../utils/validation';
import { FileText, X, Eye, Loader2, CheckCircle } from 'lucide-react';

export default function CustomNode({ id, data, style, setNodes, onShowResult, isExecuting }) {
  const { theme } = useTheme();
  const [validationError, setValidationError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // Debug logging
  // console.log('CustomNode render:', { id, isExecuting, hasResult: !!data.node_result });

  const handleInputChange = (e) => {
    e.stopPropagation(); // important to prevent drag instead of typing
    const inputValue = e.target.value;
    data.onChange?.(id, inputValue);
    setValidationError(null);
    if (data.inputType && data.node_id) {
      setIsValidating(true);
      const validation = validateNodeInput(data.node_id, inputValue);
      setTimeout(() => {
        setValidationError(validation.error);
        setIsValidating(false);
      }, 500);
    }
  };

  useEffect(() => {
    const currentInput = data.additional_input?.[data.title] || '';
    if (data.inputType && data.node_id && currentInput) {
      const validation = validateNodeInput(data.node_id, currentInput);
      setValidationError(validation.error);
    } else if (data.validationError) {
      setValidationError(data.validationError);
    } else {
      setValidationError(null);
    }
  }, [data.node_id, data.additional_input, data.title, data.inputType, data.validationError]);

  // Dynamic multi-field support based on node definition
  const hasFields = Array.isArray(data.fields) && data.fields.length > 0;
  const [multiFieldValues, setMultiFieldValues] = useState(() => {
    if (hasFields && data.additional_input?.[data.title]) {
      try {
        return JSON.parse(data.additional_input[data.title]);
      } catch {
        return {};
      }
    }
    return {};
  });

  // Update combined input for multi-field nodes
  useEffect(() => {
    if (hasFields) {
      const combined = JSON.stringify(multiFieldValues);
      data.onChange?.(id, combined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiFieldValues, hasFields]);

  // Determine minimum sizes based on whether node has input
  const hasInput = data.inputType !== undefined;
  const minWidth = hasInput ? 220 : 160;   // Increased width to accommodate larger fonts
  const minHeight = hasInput ? 120 : 80;   // Increased height to prevent border cutting

  // Simplified styles, all border/outline logic is in CSS now
  const nodeStyle = {
    padding: 0, // All padding is handled by child elements now
    width: '100%',
    height: '100%',
    background: theme.colors.node.background, // Apply theme background color
    border: `1px solid ${theme.colors.node.border}`,
    borderRadius: '6px',
    boxShadow: theme.colors.node.shadow,
    boxSizing: 'border-box', // This is crucial to include border in the total size
    position: 'relative', // Ensure proper positioning for resize handles
    overflow: 'hidden', // Changed to hidden to prevent content overflow
    display: 'flex',
    flexDirection: 'column',
    ...style, // Use the style prop from React Flow for resizing
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3px 6px', // Reduced padding
    borderBottom: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    minHeight: '20px', // Reduced height
  };

  const headerLeftStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const deleteButtonStyle = {
    width: '16px', // Increased size for better clickability
    height: '16px', // Increased size for better clickability
    background: theme.colors.button.secondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '8px',
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    transition: 'all 0.2s ease',
    padding: 0,
    outline: 'none',
    position: 'relative', // Ensure it's above other elements
    zIndex: 10, // Ensure it's clickable
  };

  const iconStyle = {
    marginRight: '4px',
    fontSize: 'var(--font-size-xs)',
    color: theme.colors.text.secondary,
  };
  
  const titleStyle = {
    fontSize: '10px', // Reduced from var(--font-size-sm)
    fontWeight: '500',
    color: theme.colors.text.primary,
  };
  
  const bodyStyle = {
    padding: '3px 6px', // Further reduced padding
    background: theme.colors.node.background,
    minHeight: hasInput ? '45px' : '25px', // Reduced height for nodes without input
    flex: 1, // Take remaining space
    display: 'flex',
    flexDirection: 'column',
  };

  const footerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0px 6px', // Set padding to 0px 6px
    borderTop: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    minHeight: '20px',
  };

  const resultLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '8px',
    color: data.node_result ? theme.colors.text.primary : theme.colors.text.secondary,
    cursor: data.node_result ? 'pointer' : 'default',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    opacity: data.node_result ? 1 : 0.6,
    marginBottom: '5px', // Move Result label and Eye icon up by 5px
  };

  const labelStyle = {
    fontSize: '9px',
    color: theme.colors.text.secondary,
    marginBottom: '1px', // Further reduced margin
    lineHeight: '1.0',
  };

  const descStyle = {
    fontSize: '8px', // Further reduced font size
    color: theme.colors.text.muted,
    marginTop: '1px', // Further reduced margin
    marginBottom: '1px', // Further reduced margin
    lineHeight: '1.0',
    fontStyle: 'italic',
  };

  const errorStyle = {
    marginTop: '2px', // Reduced margin
    padding: '2px 4px', // Reduced padding
    fontSize: '9px', // Reduced from var(--font-size-xs)
    borderRadius: '2px',
    background: '#FEE2E2',
    color: '#DC2626',
    border: '1px solid #FCA5A5',
    wordWrap: 'break-word',
    lineHeight: '1.0',
  };

  const inputStyle = {
    width: '100%',
    height: '20px', // Reduced height
    padding: '2px 4px', // Reduced padding
    fontSize: '9px', // Reduced from var(--font-size-xs)
    borderRadius: '2px',
    background: isValidating 
      ? '#FEF3C7'
      : validationError 
        ? '#FEF2F2'
        : theme.colors.surface,
    color: theme.colors.text.primary,
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    border: isValidating
      ? '1px solid #F59E0B'
      : validationError 
        ? '1px solid #FCA5A5'
        : `1px solid ${theme.colors.border}`,
    outline: 'none',
  };

  const validationIndicatorStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: data.inputType && data.additional_input?.[data.title]
      ? (isValidating 
          ? '#F59E0B' // Orange for validating
          : validationError 
            ? '#EF4444' // Red for invalid
            : '#10B981') // Green for valid
      : 'transparent',
    border: data.inputType && data.additional_input?.[data.title]
      ? `1px solid ${theme.colors.node.background}` // Use theme background for border
      : 'none',
    marginRight: '4px',
    transition: 'background-color 0.2s ease',
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (data.onDelete && typeof data.onDelete === 'function') {
      data.onDelete(id);
    }
  };

  const handleResultClick = (e) => {
    e.stopPropagation();
    onShowResult(id);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <NodeResizer 
        key={`resizer-${id}-${minWidth}-${minHeight}`}
        minWidth={minWidth} 
        minHeight={minHeight}
        isVisible={true}
        lineClassName="resize-line"
        handleClassName="resize-handle"
        onResizeStart={(event, params) => {
          // Prevent any interference with content
        }}
        onResize={(event, params) => {
          // Handle resize if needed
        }}
        onResizeEnd={(event, params) => {
          // Ensure final size is correct
        }}
        keepAspectRatio={false}
        shouldResize={(event, params) => {
          return true; // Allow all resize operations
        }}
      />
      
      {/* Source Handle (Right side) */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: theme.colors.primary,
          width: '8px',
          height: '8px',
          border: `2px solid ${theme.colors.surface}`,
        }}
      />
      
      {/* Target Handle (Left side) */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          background: theme.colors.primary,
          width: '8px',
          height: '8px',
          border: `2px solid ${theme.colors.surface}`,
        }}
      />
      
      <div style={{ ...nodeStyle, position: 'relative' }}>
        <div style={headerStyle}>
          <div style={headerLeftStyle}>
            <FileText size={10} style={{ marginRight: '3px', color: theme.colors.text.secondary }} />
            {data.inputType && <div style={validationIndicatorStyle} />}
            <div style={titleStyle}>
              {data.title.replace(/_/g, ' ')}
            </div>
            {data.isLoading && (
              <Loader2 size={14} color={theme.colors.primary} className="spin" style={{ marginLeft: 6 }} />
            )}
          </div>
          <button 
            className="node-delete-button"
            style={deleteButtonStyle} 
            onClick={handleDeleteClick}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.target.style.transform = 'scale(0.9)';
            }}
            onMouseUp={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
            onMouseEnter={(e) => {
              e.target.style.background = theme.colors.button.hover;
              e.target.style.borderColor = theme.colors.primary;
              e.target.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = theme.colors.button.secondary;
              e.target.style.borderColor = theme.colors.border;
              e.target.style.color = theme.colors.text.primary;
              e.target.style.transform = 'scale(1)';
            }}
          >
            <X size={8} style={{ color: 'currentColor' }} />
          </button>
        </div>
        <div style={bodyStyle}>
          {data.label && (
            <div style={labelStyle}>
          {data.label}
        </div>
          )}
          {/* Multi-field nodes: render fields dynamically, others: default */}
          {hasFields ? (
            <>
              {data.fields.map(field => (
                <input
                  key={field.name}
                  type={field.type}
                  className="custom-node-input"
                  placeholder={field.label}
                  value={multiFieldValues[field.name] || ''}
                  onChange={e => setMultiFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                  style={{ ...inputStyle, marginTop: field.name !== data.fields[0].name ? 4 : 0 }}
                />
              ))}
            </>
          ) : (
            data.inputType && (
              <input
                type={data.inputType}
                className="custom-node-input"
                placeholder={getValidationRules(data.node_id)}
                value={data.additional_input?.[data.title] || ''}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
                style={inputStyle}
              />
            )
          )}

          {data.description && (
            <div style={descStyle}>
              {data.description}
            </div>
          )}

          {validationError && (
            <div style={errorStyle}>
              {validationError}
            </div>
          )}
        </div>
        
        {/* Footer with Result Button */}
        <div style={footerStyle}>
          <div style={resultLabelStyle} onClick={handleResultClick}>
            <span style={{ marginTop: '-3px' }}>Result</span>
            <Eye size={10} style={{ color: 'currentColor' }} />
          </div>
        </div>
        {/* Executed check icon in bottom right */}
        {data.node_result && !data.isLoading && (
          <CheckCircle size={14} color="#22c55e" style={{ position: 'absolute', bottom: 6, right: 6, background: theme.colors.surface, borderRadius: '50%' }} title="Node executed" />
        )}
      </div>
    </div>
  );
}
