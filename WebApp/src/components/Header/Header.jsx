import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeSelector from '../ThemeSelector/ThemeSelector';
import { Rocket, Save, CheckCircle, FolderOpen, Download, Upload, Trash2, Home } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

const Header = ({ onSave, onImport, onExport, onValidate, onValidateStream, onClear, onBackToHome }) => {
  const { theme } = useTheme();

  const headerStyle = {
    height: '48px',
    background: theme.colors.surface,
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    boxShadow: theme.shadows.small,
    transition: 'all 0.3s ease',
  };

  const leftSectionStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const logoStyle = {
    fontSize: 'var(--font-size-2xl)',
    fontWeight: '700',
    color: theme.colors.text.primary,
  };

  const buttonStyle = {
    padding: '6px 12px',
    background: theme.colors.button.primary,
    border: 'none',
    borderRadius: '6px',
    color: '#FFFFFF',
    fontSize: 'var(--font-size-base)',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const secondaryButtonStyle = {
    padding: '6px 12px',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    color: theme.colors.text.primary,
    fontSize: 'var(--font-size-base)',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const handleSave = () => {
    onSave?.();
  };

  const handleImport = () => {
    // Create a file input for importing files
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.flow,.txt';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file && onImport) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            onImport(data);
          } catch (error) {
            console.error('Error parsing file:', error);
            alert('Invalid file format. Please select a valid JSON file.');
          }
        };
        reader.onerror = () => {
          alert('Error reading file. Please try again.');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    if (onExport) {
      const data = onExport();
      if (data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${APP_NAME.toLowerCase()}-flow-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleClear = () => {
    if (onClear) {
      const confirmed = window.confirm('Are you sure you want to clear the current flow? This action cannot be undone.');
      if (confirmed) {
        onClear();
      }
    }
  };

  return (
    <header style={headerStyle} className="app-header">
      <div style={leftSectionStyle}>
        <div style={logoStyle}>
          <Rocket size={18} style={{ marginRight: '8px' }} />
          {APP_NAME}
        </div>
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            style={{
              ...secondaryButtonStyle,
              marginLeft: '20px',
              padding: '6px 10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = theme.colors.border;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = theme.colors.surface;
            }}
          >
            <Home size={14} />
            Home
          </button>
        )}
      </div>

      <div style={rightSectionStyle}>
        <button
          className="header-button"
          onClick={handleSave}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = theme.colors.button.hover;
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = theme.colors.button.primary;
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <Save size={14} />
          Save
        </button>

        <button
          onClick={onValidate}
          style={secondaryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = theme.colors.border;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = theme.colors.surface;
          }}
        >
          <CheckCircle size={14} />
          Execute
        </button>

        <button
          onClick={onValidateStream}
          style={secondaryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = theme.colors.border;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = theme.colors.surface;
          }}
        >
          <CheckCircle size={14} />
          Execute Stream
        </button>

        <button
          className="header-button"
          style={secondaryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = theme.colors.border;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = theme.colors.surface;
          }}
        >
          <FolderOpen size={14} />
          Open
        </button>

        <button
          className="header-button"
          onClick={handleImport}
          style={secondaryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = theme.colors.border;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = theme.colors.surface;
          }}
        >
          <Download size={14} />
          Import
        </button>

        <button
          className="header-button"
          onClick={handleExport}
          style={secondaryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = theme.colors.border;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = theme.colors.surface;
          }}
        >
          <Upload size={14} />
          Export
        </button>

        <button
          className="header-button"
          onClick={handleClear}
          style={secondaryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = theme.colors.border;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = theme.colors.surface;
          }}
        >
          <Trash2 size={14} />
          Clear
        </button>

        <ThemeSelector />
      </div>
    </header>
  );
};

export default Header; 