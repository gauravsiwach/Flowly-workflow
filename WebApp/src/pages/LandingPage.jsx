import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Zap, Globe, Mail, Brain, ArrowRight, Play, BookOpen, Users, Star, CheckCircle, Github, ExternalLink } from 'lucide-react';
import HeroFlowAnimation from '../components/HeroFlowAnimation';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <nav style={{ display: 'flex', gap: '30px' }}>
            <a href="#features" 
               onClick={(e) => {
                 e.preventDefault();
                 document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
               }}
               style={{ 
                 color: theme.colors.text.secondary, 
                 textDecoration: 'none',
                 fontWeight: '500',
                 transition: 'color 0.2s ease',
                 cursor: 'pointer'
               }}
               onMouseEnter={(e) => e.target.style.color = theme.colors.primary}
               onMouseLeave={(e) => e.target.style.color = theme.colors.text.secondary}
            >
              Features
            </a>
            <a href="#templates" 
               onClick={(e) => {
                 e.preventDefault();
                 document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
               }}
               style={{ 
                 color: theme.colors.text.secondary, 
                 textDecoration: 'none',
                 fontWeight: '500',
                 transition: 'color 0.2s ease',
                 cursor: 'pointer'
               }}
               onMouseEnter={(e) => e.target.style.color = theme.colors.primary}
               onMouseLeave={(e) => e.target.style.color = theme.colors.text.secondary}
            >
              Templates
            </a>
            <a href="#opensource" 
               onClick={(e) => {
                 e.preventDefault();
                 document.getElementById('opensource').scrollIntoView({ behavior: 'smooth' });
               }}
               style={{ 
                 color: theme.colors.text.secondary, 
                 textDecoration: 'none',
                 fontWeight: '500',
                 transition: 'color 0.2s ease',
                 cursor: 'pointer'
               }}
               onMouseEnter={(e) => e.target.style.color = theme.colors.primary}
               onMouseLeave={(e) => e.target.style.color = theme.colors.text.secondary}
            >
              Open Source
            </a>
          </nav>
          <button
            onClick={onGetStarted}
            style={{
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = theme.colors.button.hover;
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = theme.colors.primary;
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // space-between to push content to top and bottom
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        minHeight: '520px', // slightly taller for more space
        maxWidth: '100vw',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
      }}>
        {/* Heading at the very top */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          width: '100%',
          maxWidth: '800px',
          padding: '0px 20px 0 20px', // 0px from top (50px higher)
          textAlign: 'center',
        }}>
          <h1 style={{ 
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: theme.colors.text.primary
          }}>
            Flowly – No Code. No Limits.
          </h1>
        </div>
        {/* Animation in the center, absolutely positioned to fill section */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <HeroFlowAnimation />
        </div>
        {/* Description and button at the very bottom */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          width: '100%',
          maxWidth: '800px',
          padding: '0 20px 60px 20px', // 60px from bottom
          textAlign: 'center',
        }}>
          <p style={{ 
            fontSize: '1.2rem',
            color: theme.colors.text.secondary,
            marginBottom: '5px',
            lineHeight: '1.6'
          }}>
           Turn your needs, ideas, and problems into intelligent, AI-powered solutions with Flowly.
Think it. Plan it. Drag it. With Flowly’s no-code and AI-driven builder, anyone can create powerful workflows—this is the future where everyone can code without coding.
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
              margin: '0 auto',
              marginBottom: '24px'
            }}
          >
            <Play size={20} />
            Start Building
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ 
        padding: '60px 20px',
        backgroundColor: theme.colors.surface,
        marginTop: '0'
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
      <section id="templates" style={{ 
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
      <section id="opensource" style={{ 
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