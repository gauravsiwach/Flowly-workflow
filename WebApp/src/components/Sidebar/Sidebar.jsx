// Sidebar.js
import React, { useState, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Package, Clipboard, Globe, Cloud, FileText, Mail, Send, X, ChevronLeft, ChevronRight, Newspaper, Code, ChevronDown, ChevronRight as ChevronRightIcon, Zap, TrendingUp, AlertTriangle, Calendar, Info } from 'lucide-react';
import { getNodes, nodeCategories } from '../../config_definitions/nodes';
import { getTemplates, getTemplateCategories } from '../../config_definitions/templates';

const Sidebar = ({ onAddNode, isOpen, onToggle, onLoadTemplate }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('nodes');
  
  // Add state for collapsible categories
  const [expandedCategories, setExpandedCategories] = useState({
    "Web & Data Collection": true,
    "AI & Processing": false,
    "Communication & Output": false,
    "External Services": false
  });

  // Add state for expanded templates
  const [expandedTemplates, setExpandedTemplates] = useState({});

  // Add state for custom tooltip
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });

  // Memoize nodes and templates to prevent recreation on every render
  const nodes = useMemo(() => getNodes(theme), [theme]);
  const templates = useMemo(() => getTemplates(theme), [theme]);
  const templateCategories = useMemo(() => getTemplateCategories(templates), [templates]);

  // Helper function to get nodes by category
  const getNodesByCategory = (categoryName) => {
    const categoryNodeTitles = nodeCategories[categoryName];
    return nodes.filter(node => categoryNodeTitles.includes(node.title));
  };

  // Toggle category expansion
  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Toggle template expansion
  const toggleTemplate = (templateId) => {
    setExpandedTemplates(prev => ({
      ...prev,
      [templateId]: !prev[templateId]
    }));
  };

  // Toggle all categories
  const toggleAllCategories = () => {
    const allExpanded = Object.values(expandedCategories).every(expanded => expanded);
    setExpandedCategories(prev => {
      const newState = {};
      Object.keys(prev).forEach(category => {
        newState[category] = !allExpanded;
      });
      return newState;
    });
  };

  const sidebarStyle = {
    position: 'fixed',
    top: '48px', // Match header height
    left: isOpen ? '0' : '-350px',
    width: '350px',
    height: 'calc(100vh - 48px)',
    background: theme.colors.surface,
    borderRight: `1px solid ${theme.colors.border}`,
    boxShadow: isOpen ? theme.shadows.large : 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: '20px 24px',
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: theme.colors.background,
  };

  const titleStyle = {
    fontSize: 'var(--font-size-xl)',
    fontWeight: '600',
    color: theme.colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: 0,
  };

  const subtitleStyle = {
    margin: 0,
    fontSize: 'var(--font-size-xs)',
    color: theme.colors.text.muted,
    lineHeight: '1.3',
  };

  const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  const toggleButtonStyle = {
    position: 'fixed',
    top: '50%',
    left: isOpen ? '350px' : '0',
    transform: 'translateY(-50%)',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderLeft: 'none',
    borderRadius: '0 8px 8px 0',
    padding: '14px 10px',
    cursor: 'pointer',
    boxShadow: theme.shadows.small,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const tabsContainerStyle = {
    display: 'flex',
    borderBottom: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
  };

  const tabStyle = (isActive) => ({
    flex: 1,
    padding: '14px 18px',
    background: isActive ? theme.colors.surface : 'transparent',
    border: 'none',
    color: isActive ? theme.colors.text.primary : theme.colors.text.secondary,
    fontSize: 'var(--font-size-base)',
    fontWeight: isActive ? '500' : '400',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderBottom: isActive ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  });

  const contentStyle = {
    flex: 1,
    padding: '4px 8px 8px 8px',
    overflowY: 'auto',
    background: theme.colors.surface,
    width: '100%',
    boxSizing: 'border-box',
  };

  const sectionStyle = {
    marginBottom: '12px',
  };

  const sectionTitleStyle = {
    fontSize: 'var(--font-size-lg)',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const buttonStyle = (btn) => ({
    width: '100%',
    background: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    padding: '8px 14px',
    minHeight: '45px',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: 'var(--font-size-base)',
    fontWeight: '500',
    color: theme.colors.text.primary,
    transition: 'all 0.2s ease',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    marginBottom: '3px',
    outline: 'none',
    justifyContent: 'center',
    '&:hover': {
      borderColor: theme.colors.primary,
      boxShadow: `0 2px 8px rgba(0, 0, 0, 0.1)`,
    },
  });

  const nodeTitleStyle = {
    fontSize: 'var(--font-size-base)',
    fontWeight: '600',
    lineHeight: '1.3',
    color: theme.colors.text.primary,
  };

  const nodeDescriptionStyle = {
    fontSize: 'var(--font-size-xs)',
    color: theme.colors.text.secondary,
    lineHeight: '1.4',
  };

  const emptyStateStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: theme.colors.text.muted,
    textAlign: 'center',
    padding: '20px',
  };

  const emptyIconStyle = {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.4,
  };

  const emptyTextStyle = {
    fontSize: 'var(--font-size-lg)',
    marginBottom: '8px',
    fontWeight: '500',
    color: theme.colors.text.primary,
  };

  const emptySubtextStyle = {
    fontSize: 'var(--font-size-sm)',
    opacity: 0.7,
    lineHeight: '1.4',
    color: theme.colors.text.secondary,
  };

  // Custom button component using div instead of button
  const CustomButton = ({ children, onClick, style, onMouseEnter, onMouseLeave, className }) => (
    <button
      onClick={onClick}
      style={{
        ...style,
        cursor: 'pointer',
        outline: 'none',
        border: 'none',
        fontFamily: 'inherit',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* Toggle Button */}
      <button
        style={toggleButtonStyle}
        onClick={onToggle}
        onMouseEnter={(e) => {
          e.target.style.background = theme.colors.border;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = theme.colors.surface;
        }}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Sidebar Panel */}
      <div style={sidebarStyle} className="app-sidebar">
        <div style={headerStyle}>
          <div style={titleStyle}>
            <Package size={18} />
            Node Library
          </div>
          <button
            style={closeButtonStyle}
            onClick={onToggle}
            onMouseEnter={(e) => {
              e.target.style.background = theme.colors.border;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={tabsContainerStyle}>
          <CustomButton
            className="sidebar-tab-button"
            style={tabStyle(activeTab === 'nodes')}
            onClick={() => setActiveTab('nodes')}
          >
            <Package size={14} />
            Nodes
          </CustomButton>
          <CustomButton
            className="sidebar-tab-button"
            style={tabStyle(activeTab === 'templates')}
            onClick={() => setActiveTab('templates')}
          >
            <Clipboard size={14} />
            Templates
          </CustomButton>
        </div>

        <div style={contentStyle}>
          {activeTab === 'nodes' && (
            <div style={sectionStyle}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <h3 style={sectionTitleStyle}>
                  Available Nodes
                </h3>
                <CustomButton
                  onClick={toggleAllCategories}
                  style={{
                    background: theme.colors.primary,
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: theme.colors.primary,
                      opacity: 0.9,
                    },
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '1';
                  }}
                >
                  {Object.values(expandedCategories).every(expanded => expanded) ? 'Collapse All' : 'Expand All'}
                </CustomButton>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {Object.entries(nodeCategories).map(([categoryName, categoryNodeTitles]) => {
                  const categoryNodes = getNodesByCategory(categoryName);
                  const isExpanded = expandedCategories[categoryName];
                  
                  return (
                    <div key={categoryName} style={{ marginBottom: '2px' }}>
                      {/* Category Header - Tab Style */}
                      <CustomButton
                        onClick={() => toggleCategory(categoryName)}
                        style={{
                          width: '100%',
                          background: isExpanded ? theme.colors.surface : 'transparent',
                          border: 'none',
                          padding: '12px 16px',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: isExpanded ? '600' : '500',
                          color: isExpanded ? theme.colors.text.primary : theme.colors.text.secondary,
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          marginBottom: '4px',
                          transition: 'all 0.2s ease',
                          borderBottom: isExpanded ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
                          borderRadius: '0',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = theme.colors.surface;
                          e.target.style.color = theme.colors.text.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = isExpanded ? theme.colors.surface : 'transparent';
                          e.target.style.color = isExpanded ? theme.colors.text.primary : theme.colors.text.secondary;
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRightIcon size={14} />}
                          <span>{categoryName}</span>
                          <span style={{ 
                            fontSize: 'var(--font-size-xs)', 
                            color: theme.colors.text.muted,
                            background: theme.colors.background,
                            padding: '2px 6px',
                            borderRadius: '12px',
                            fontWeight: '500'
                          }}>
                            {categoryNodes.length}
                          </span>
                        </div>
                      </CustomButton>
                      
                      {/* Category Nodes - Simple Style */}
                      {isExpanded && (
                        <div style={{ 
                          marginLeft: '16px',
                          paddingLeft: '16px',
                          borderLeft: `2px solid ${theme.colors.border}`,
                          animation: 'slideDown 0.3s ease-out'
                        }}>
                          {categoryNodes.map((btn) => {
                            const IconComponent = btn.icon;
                            return (
                              <CustomButton
                                key={btn.title}
                                className="sidebar-node-button"
                                onClick={() => onAddNode(btn)}
                                style={buttonStyle(btn)}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <IconComponent size={16} style={{ color: theme.colors.text.secondary }} />
                                  <div style={nodeTitleStyle}>{btn.title.replace(/_/g, ' ')}</div>
                                </div>
                                <div style={nodeDescriptionStyle}>{btn.description}</div>
                              </CustomButton>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div style={sectionStyle}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <h3 style={sectionTitleStyle}>
                  <Clipboard size={18} />
                  Workflow Templates
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(templateCategories).map(([categoryName, categoryTemplates]) => {
                  if (categoryTemplates.length === 0) return null;
                  
                  return (
                    <div key={categoryName} style={{ marginBottom: '8px' }}>
                      {/* Category Header */}
                      <div style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: '600',
                        color: theme.colors.text.secondary,
                        marginBottom: '8px',
                        padding: '0 4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {categoryName}
                      </div>
                      
                      {/* Templates in Category */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {categoryTemplates.map((template) => {
                          const IconComponent = template.icon;
                          const isExpanded = expandedTemplates[template.id];
                          
                          return (
                            <div key={template.id} style={{ marginBottom: '4px' }}>
                              {/* Template Header - Collapsible */}
                              <CustomButton
                                onClick={() => toggleTemplate(template.id)}
                                style={{
                                  width: '100%',
                                  background: isExpanded ? theme.colors.surface : theme.colors.background,
                                  border: `1px solid ${isExpanded ? theme.colors.primary : theme.colors.border}`,
                                  padding: '12px 16px',
                                  cursor: 'pointer',
                                  borderRadius: '8px',
                                  fontSize: 'var(--font-size-base)',
                                  fontWeight: '500',
                                  color: theme.colors.text.primary,
                                  transition: 'all 0.2s ease',
                                  textAlign: 'left',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  outline: 'none',
                                  position: 'relative',
                                  marginBottom: isExpanded ? '8px' : '0',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isExpanded) {
                                    e.target.style.borderColor = theme.colors.primary;
                                    e.target.style.boxShadow = `0 2px 8px rgba(0, 0, 0, 0.1)`;
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isExpanded) {
                                    e.target.style.borderColor = theme.colors.border;
                                    e.target.style.boxShadow = 'none';
                                  }
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{
                                    background: theme.colors.primary,
                                    color: 'white',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <IconComponent size={16} />
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{
                                      fontSize: 'var(--font-size-base)',
                                      fontWeight: '600',
                                      color: theme.colors.text.primary,
                                      marginBottom: '2px'
                                    }}>
                                      {template.name}
                                    </div>
                                    <div style={{
                                      fontSize: 'var(--font-size-xs)',
                                      color: theme.colors.text.muted,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}>
                                      <span style={{
                                        background: template.difficulty === 'Beginner' ? '#10b981' : '#f59e0b',
                                        color: 'white',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: '500'
                                      }}>
                                        {template.difficulty}
                                      </span>
                                      <span>•</span>
                                      <span>{template.nodes.length} nodes</span>
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <CustomButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onLoadTemplate?.(template);
                                    }}
                                    style={{
                                      background: theme.colors.primary,
                                      color: 'white',
                                      border: 'none',
                                      padding: '6px',
                                      borderRadius: '50%',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      outline: 'none',
                                      width: '24px',
                                      height: '24px',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.background = theme.colors.primary;
                                      e.target.style.opacity = '0.9';
                                      e.target.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.background = theme.colors.primary;
                                      e.target.style.opacity = '1';
                                      e.target.style.transform = 'scale(1)';
                                    }}
                                  >
                                    <Zap size={12} />
                                  </CustomButton>
                                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRightIcon size={16} />}
                                </div>
                              </CustomButton>
                              
                              {/* Template Details - Expanded */}
                              {isExpanded && (
                                <div style={{
                                  background: theme.colors.surface,
                                  border: `1px solid ${theme.colors.border}`,
                                  borderRadius: '8px',
                                  padding: '16px',
                                  marginLeft: '8px',
                                  marginRight: '8px',
                                  animation: 'slideDown 0.3s ease-out'
                                }}>
                                  {/* Template Description */}
                                  <div style={{
                                    fontSize: 'var(--font-size-sm)',
                                    color: theme.colors.text.secondary,
                                    lineHeight: '1.4',
                                    marginBottom: '12px'
                                  }}>
                                    {template.description}
                                  </div>
                                  
                                  {/* Template Preview */}
                                  <div 
                                    className="template-nodes-container"
                                    style={{
                                      marginBottom: '16px'
                                    }}
                                  >
                                    {template.nodes.map((node, index) => (
                                      <div 
                                        key={index} 
                                        className="template-node-preview"
                                        onMouseEnter={(e) => {
                                          setTooltip({
                                            show: true,
                                            text: node.title.replace(/_/g, ' '),
                                            x: e.clientX + 10,
                                            y: e.clientY - 10
                                          });
                                        }}
                                        onMouseLeave={() => {
                                          setTooltip({ show: false, text: '', x: 0, y: 0 });
                                        }}
                                      >
                                        {node.icon && <node.icon size={10} />}
                                        <span className="template-node-text">
                                          {node.title.replace(/_/g, ' ')}
                                        </span>
                                        <Info size={8} style={{ opacity: 0.6, marginLeft: '2px' }} />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom Tooltip */}
      {tooltip.show && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: 'var(--font-size-sm)',
            color: theme.colors.text.primary,
            boxShadow: theme.shadows.medium,
            zIndex: 10000,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            maxWidth: '200px',
            wordWrap: 'break-word'
          }}
        >
          {tooltip.text}
        </div>
      )}
    </>
  );
};

export default Sidebar;
