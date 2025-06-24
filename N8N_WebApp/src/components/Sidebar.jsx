// Sidebar.js
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Package, Clipboard, Globe, Cloud, FileText, Mail, Send, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ onAddNode, isOpen, onToggle }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('nodes');

const nodes = [
  {
    id: '8c5a1f02-d0cd-4c6d-96b6-51f1bc1f0b17', // fetch_html_content
    title: 'Fetch_HTML_Content',
    label: 'Enter Web page URL',
      color: theme.colors.background,
    type: 'custom',
    description: 'Fetches HTML content from a URL',
      inputType: 'text',
      icon: Globe,
  },
  {
    id: 'fdc3b924-2f2a-43e8-923f-3f118a51eb0e', // get_weather
    title: 'Get_Weather',
    label: 'Enter City Name',
      color: theme.colors.background,
    type: 'custom',
    description: 'Fetches current weather info',
      inputType: 'text',
      icon: Cloud,
  },
  {
    id: '0ff35b88-681c-4c64-94b5-7b74dbfbb471', // summarize_html_content
    title: 'Summarize_HTML',
    label: '',
      color: theme.colors.background,
      type: 'custom',
      description: 'Get summary from AI models',
      icon: FileText,
  },
  {
    id: '1a7c2b8e-e4ae-4c8e-b2c4-999b4b3cf80d', // convert_to_html_template
    title: 'Convert_to_HTML_Template',
    label: '',
      color: theme.colors.background,
      type: 'custom',
    description: 'Transforms summary into email-ready HTML',
      icon: Mail,
  },
  {
    id: '6789d23f-1352-4b11-b9a3-2f4f6f96fcd0', // send_email
    title: 'Send_Email',
    label: 'Enter email address',
      color: theme.colors.background,
    type: 'custom',
    description: 'Sends the final HTML via email',
      inputType: 'text',
      icon: Send,
  },
];

  const sidebarStyle = {
    position: 'fixed',
    top: '48px', // Match header height
    left: isOpen ? '0' : '-300px',
    width: '300px',
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
    left: isOpen ? '300px' : '0',
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
    padding: '6px 12px 12px 12px',
    overflowY: 'auto',
    background: theme.colors.surface,
  };

  const sectionStyle = {
    marginBottom: '16px',
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
              <h3 style={sectionTitleStyle}>
                Available Nodes
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {nodes.map((btn) => {
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
            </div>
          )}

          {activeTab === 'templates' && (
            <div style={emptyStateStyle}>
              <Clipboard size={48} style={emptyIconStyle} />
              <div style={emptyTextStyle}>No Templates Available</div>
              <div style={emptySubtextStyle}>
                Templates will be available soon. You'll be able to save and reuse your workflows.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
