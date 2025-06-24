import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Settings, X, ChevronLeft, ChevronRight, Database, Palette, Code, Shield, MessageSquare } from 'lucide-react';

const ConfigPanel = ({ isOpen, onToggle }) => {
  const { theme, fontSize, setFontSize, gridOpacity, setGridOpacity } = useTheme();
  const [activeTab, setActiveTab] = useState('general');

  const panelStyle = {
    position: 'fixed',
    top: '48px', // Match header height
    right: isOpen ? '0' : '-450px',
    width: '450px',
    height: 'calc(100vh - 48px)',
    background: theme.colors.surface,
    borderLeft: `1px solid ${theme.colors.border}`,
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
    padding: '24px',
    overflowY: 'auto',
    background: theme.colors.surface,
  };

  const sectionStyle = {
    marginBottom: '32px',
  };

  const sectionTitleStyle = {
    fontSize: 'var(--font-size-lg)',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const inputGroupStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    fontSize: 'var(--font-size-sm)',
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginBottom: '8px',
    display: 'block',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    fontSize: 'var(--font-size-base)',
    background: theme.colors.background,
    color: theme.colors.text.primary,
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const toggleButtonStyle = {
    position: 'fixed',
    top: '50%',
    right: isOpen ? '450px' : '0',
    transform: 'translateY(-50%)',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRight: 'none',
    borderRadius: '8px 0 0 8px',
    padding: '14px 10px',
    cursor: 'pointer',
    boxShadow: theme.shadows.small,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const renderGeneralTab = () => (
    <div style={contentStyle}>
      {/* <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <Database size={16} />
          Workflow Settings
        </div>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Workflow Name</label>
          <input
            type="text"
            placeholder="My Workflow"
            style={inputStyle}
            defaultValue="N8N Flow Builder"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Description</label>
          <input
            type="text"
            placeholder="Enter workflow description"
            style={inputStyle}
            defaultValue="Automated workflow for content processing"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Auto-save Interval</label>
          <select style={selectStyle} defaultValue="30">
            <option value="15">15 seconds</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
          </select>
        </div>
      </div> */}

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <Shield size={16} />
          Security Settings
        </div>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>API Key</label>
          <input
            type="password"
            placeholder="Enter your API key"
            style={inputStyle}
          />
        </div>

        {/* <div style={inputGroupStyle}>
          <label style={labelStyle}>Environment</label>
          <select style={selectStyle} defaultValue="development">
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
        </div> */}
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div style={contentStyle}>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <Palette size={16} />
          Visual Settings
        </div>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Font Size</label>
          <select 
            style={selectStyle} 
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Grid Opacity: {gridOpacity}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={gridOpacity}
            onChange={(e) => setGridOpacity(parseInt(e.target.value))}
            style={{
              ...inputStyle,
              padding: '4px',
              height: '6px',
            }}
          />
        </div>

        {/* <div style={inputGroupStyle}>
          <label style={labelStyle}>Animation Speed</label>
          <select style={selectStyle} defaultValue="normal">
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div> */}
      </div>
    </div>
  );

  const renderCommentTab = () => (
    <div style={contentStyle}>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <MessageSquare size={16} />
          Comments & Notes
        </div>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Workflow Comments</label>
          <textarea
            placeholder="Add comments about this workflow..."
            style={{
              ...inputStyle,
              minHeight: '100px',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            defaultValue="This workflow automates content processing and data transformation tasks."
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Node Notes</label>
          <textarea
            placeholder="Add notes about specific nodes..."
            style={{
              ...inputStyle,
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            defaultValue="HTTP Request node: Configure timeout settings for external API calls"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Version Notes</label>
          <textarea
            placeholder="Document changes and updates..."
            style={{
              ...inputStyle,
              minHeight: '60px',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            defaultValue="v1.2.0 - Added error handling for failed API responses"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Collaboration Notes</label>
          <textarea
            placeholder="Notes for team collaboration..."
            style={{
              ...inputStyle,
              minHeight: '60px',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            defaultValue="Contact: john.doe@company.com for integration questions"
          />
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div style={contentStyle}>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <Code size={16} />
          Advanced Settings
        </div>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Debug Mode</label>
          <select style={selectStyle} defaultValue="off">
            <option value="off">Off</option>
            <option value="on">On</option>
          </select>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Log Level</label>
          <select style={selectStyle} defaultValue="info">
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Cache Duration</label>
          <input
            type="number"
            placeholder="300"
            style={inputStyle}
            defaultValue="300"
          />
        </div>
      </div>
    </div>
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
        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Config Panel */}
      <div style={panelStyle}>
        <div style={headerStyle}>
          <div style={titleStyle}>
            <Settings size={18} />
            Configuration
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
          <button
            style={tabStyle(activeTab === 'general')}
            onClick={() => setActiveTab('general')}
          >
            <Database size={14} />
            General
          </button>
          <button
            style={tabStyle(activeTab === 'appearance')}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette size={14} />
            Appearance
          </button>
          {/* <button
            style={tabStyle(activeTab === 'advanced')}
            onClick={() => setActiveTab('advanced')}
          >
            <Code size={14} />
            Advanced
          </button> */}
        </div>

        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'appearance' && renderAppearanceTab()}
        {/* {activeTab === 'advanced' && renderAdvancedTab()} */}
      </div>
    </>
  );
};

export default ConfigPanel; 