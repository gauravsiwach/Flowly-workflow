import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeSelector from '../ThemeSelector/ThemeSelector';
import { Rocket, Save, CheckCircle, FolderOpen, Download, Upload, Trash2, Home } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

const Header = ({ onSave, onImport, onExport, onValidate, onValidateStream, onClear, onBackToHome }) => {
  const { theme } = useTheme();
  const { user, loginWithGoogle, logout, isAuthenticated } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef();

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Ensure user menu is closed after login/logout
  useEffect(() => {
    setUserMenuOpen(false);
  }, [isAuthenticated]);

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

  const userMenuStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    boxShadow: theme.shadows.large,
    padding: '16px',
    minWidth: '220px',
    zIndex: 1000,
    marginTop: '8px',
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
  };

  const userAvatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  };

  const userNameStyle = {
    fontSize: 'var(--font-size-sm)',
    fontWeight: '500',
    color: theme.colors.text.primary,
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const logoutButtonStyle = {
    width: '100%',
    padding: '8px 12px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: 'var(--font-size-sm)',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '8px',
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      loginWithGoogle(codeResponse);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      // Show user-friendly error message
      alert('Login failed. Please try again or check your browser settings.');
    },
    flow: 'implicit',
    scope: 'openid email profile',
  });

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
        {isAuthenticated ? (
          <div style={{ position: 'relative' }} ref={userMenuRef}>
            <div
              style={userInfoStyle}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              onMouseEnter={(e) => {
                e.target.style.background = theme.colors.border;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = theme.colors.background;
              }}
            >
              <img 
                src={user.picture} 
                alt={user.name}
                style={userAvatarStyle}
              />
              <span style={userNameStyle}>{user.name}</span>
              <span style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
                {userMenuOpen ? '▲' : '▼'}
              </span>
            </div>
            {userMenuOpen && (
              <div style={userMenuStyle}>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: '600', color: theme.colors.text.primary, marginBottom: '4px' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
                    {user.email}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: theme.colors.text.muted, 
                  background: theme.colors.background,
                  padding: '8px',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}>
                  <div>User ID: {user.sub}</div>
                  <div>Verified: {user.email_verified ? 'Yes' : 'No'}</div>
                </div>
                <button
                  onClick={logout}
                  style={logoutButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ef4444';
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              // Trigger Google OAuth login using the hook
              login();
            }}
            style={{
              ...secondaryButtonStyle,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: '500',
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.text.primary,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = theme.colors.border;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = theme.colors.surface;
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  );
};

export default Header; 