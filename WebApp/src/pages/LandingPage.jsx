import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Zap, Globe, Mail, Brain, ArrowRight, Play, BookOpen, Users, Star, CheckCircle, Github, ExternalLink } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  const { theme } = useTheme();

  const features = [
    {
      icon: Zap,
      title: 'Visual Workflow Builder',
      description: 'Drag-and-drop interface to create complex workflows'
    },
    {
      icon: Globe,
      title: 'Web Content Automation',
      description: 'Fetch and process web content automatically'
    },
    {
      icon: Mail,
      title: 'Email Automation',
      description: 'Send personalized emails with generated content'
    },
    {
      icon: Brain,
      title: 'AI-Powered Processing',
      description: 'Leverage OpenAI for intelligent content processing'
    },
    {
      icon: BookOpen,
      title: 'Pre-built Templates',
      description: 'Start with ready-to-use workflow templates'
    }
  ];

  const exampleTemplates = [
    {
      name: 'News Digest',
      description: 'Fetch tech news, summarize, and email daily digest'
    },
    {
      name: 'Weather Alerts',
      description: 'Get weather updates and send personalized alerts'
    },
    {
      name: 'Content Monitor',
      description: 'Monitor websites for changes and get notifications'
    }
  ];

  return (
    <div style={{ 
      backgroundColor: theme.colors.background,
      color: theme.colors.text.primary,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{ 
        padding: '20px',
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={32} color={theme.colors.primary} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Flowly</h1>
        </div>
        <button
          onClick={onGetStarted}
          style={{
            backgroundColor: theme.colors.primary,
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '60px 20px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: theme.colors.text.primary
        }}>
          Visual Workflow Automation
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          color: theme.colors.text.secondary,
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Build powerful automation workflows with our intuitive drag-and-drop interface. 
          Start with pre-built templates or create custom workflows from scratch.
        </p>
        <button
          onClick={onGetStarted}
          style={{
            backgroundColor: theme.colors.primary,
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '0 auto'
          }}
        >
          <Play size={20} />
          Start Building
        </button>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: '60px 20px',
        backgroundColor: theme.colors.surface,
        marginTop: '40px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center',
            fontSize: '2rem',
            marginBottom: '50px',
            color: theme.colors.text.primary
          }}>
            Key Features
          </h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '25px'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                padding: '25px',
                backgroundColor: theme.colors.background,
                borderRadius: '8px',
                border: `1px solid ${theme.colors.border}`,
                textAlign: 'center'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: theme.colors.primary + '20',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px'
                }}>
                  <feature.icon size={24} color={theme.colors.primary} />
                </div>
                <h3 style={{ 
                  fontSize: '1.2rem',
                  marginBottom: '10px',
                  color: theme.colors.text.primary
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: theme.colors.text.secondary,
                  lineHeight: '1.5'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section style={{ 
        padding: '60px 20px',
        backgroundColor: theme.colors.background
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center',
            fontSize: '2rem',
            marginBottom: '20px',
            color: theme.colors.text.primary
          }}>
            Popular Templates
          </h2>
          <p style={{ 
            textAlign: 'center',
            color: theme.colors.text.secondary,
            marginBottom: '40px',
            fontSize: '1.1rem'
          }}>
            Start with these ready-to-use workflow templates
          </p>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {exampleTemplates.map((template, index) => (
              <div key={index} style={{
                padding: '20px',
                backgroundColor: theme.colors.surface,
                borderRadius: '8px',
                border: `1px solid ${theme.colors.border}`,
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ 
                  fontSize: '1.2rem',
                  marginBottom: '8px',
                  color: theme.colors.text.primary
                }}>
                  {template.name}
                </h3>
                <p style={{ 
                  color: theme.colors.text.secondary,
                  lineHeight: '1.5'
                }}>
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '60px 20px',
        backgroundColor: theme.colors.surface,
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2rem',
            marginBottom: '20px',
            color: theme.colors.text.primary
          }}>
            Ready to Automate?
          </h2>
          <p style={{ 
            fontSize: '1.1rem',
            color: theme.colors.text.secondary,
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            Build enterprise-grade workflow automation with our visual no-code platform. 
            Deploy on your own infrastructure with full control over data and processes. 
            Scale from simple automations to complex business workflows.
          </p>
          <button
            onClick={onGetStarted}
            style={{
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto'
            }}
          >
            <ArrowRight size={20} />
            Get Started Now
          </button>
        </div>
      </section>

      {/* Open Source Section */}
      <section style={{ 
        padding: '60px 20px',
        backgroundColor: theme.colors.surface,
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: theme.colors.primary + '20',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Github size={30} color={theme.colors.primary} />
          </div>
          <h2 style={{ 
            fontSize: '2rem',
            marginBottom: '15px',
            color: theme.colors.text.primary
          }}>
            Open Source
          </h2>
          <p style={{ 
            fontSize: '1.1rem',
            color: theme.colors.text.secondary,
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            Flowly is completely open source and free to use. 
            Contribute, fork, or star the project on GitHub.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: theme.colors.primary,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Github size={18} />
              View on GitHub
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'transparent',
                color: theme.colors.primary,
                border: `2px solid ${theme.colors.primary}`,
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.primary + '20'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <Star size={18} />
              Star Project
            </a>
          </div>
          <div style={{ 
            marginTop: '30px',
            padding: '20px',
            backgroundColor: theme.colors.background,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <h3 style={{ 
              fontSize: '1.2rem',
              marginBottom: '10px',
              color: theme.colors.text.primary
            }}>
              Why Open Source?
            </h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color={theme.colors.primary} />
                <span style={{ color: theme.colors.text.secondary }}>Transparent & Trustworthy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color={theme.colors.primary} />
                <span style={{ color: theme.colors.text.secondary }}>Community Driven</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color={theme.colors.primary} />
                <span style={{ color: theme.colors.text.secondary }}>Customizable</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 