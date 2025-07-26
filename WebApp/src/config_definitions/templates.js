import { Mail, FileText, Send, Newspaper, Code, Edit3 } from 'lucide-react';

// Template definitions as separate variables
const newsEmailTemplate = (theme) => ({
  id: 'news-email-template',
  name: 'News Update Email',
  description: 'Fetch latest news, summarize, and send via email',
  icon: Mail,
  category: 'Communication',
  difficulty: 'Beginner',
  nodes: [
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // fetch_top_news
      title: 'Fetch_Top_News',
      label: '',
      color: theme.colors.background,
      type: 'custom',
      description: 'Fetches latest news headlines from RSS feeds',
      icon: Newspaper,
      position: { x: 100, y: 100 }
    },
    {
      id: '0ff35b88-681c-4c64-94b5-7b74dbfbb471', // summarize_html_content
      title: 'Summarize_HTML',
      label: '',
      color: theme.colors.background,
      type: 'custom',
      description: 'Get summary from AI models',
      icon: FileText,
      position: { x: 400, y: 100 }
    },
    {
      id: '1a7c2b8e-e4ae-4c8e-b2c4-999b4b3cf80d', // convert_to_html_template
      title: 'Convert_to_HTML_Template',
      label: '',
      color: theme.colors.background,
      type: 'custom',
      description: 'Transforms summary into email-ready HTML',
      icon: Mail,
      position: { x: 700, y: 100 }
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
      position: { x: 1000, y: 100 }
    }
  ],
  edges: [
    { id: 'e1', source: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', target: '0ff35b88-681c-4c64-94b5-7b74dbfbb471' },
    { id: 'e2', source: '0ff35b88-681c-4c64-94b5-7b74dbfbb471', target: '1a7c2b8e-e4ae-4c8e-b2c4-999b4b3cf80d' },
    { id: 'e3', source: '1a7c2b8e-e4ae-4c8e-b2c4-999b4b3cf80d', target: '6789d23f-1352-4b11-b9a3-2f4f6f96fcd0' }
  ]
});

const blogHtmlTemplate = (theme) => ({
  id: 'blog-html-template',
  name: 'Blog HTML Editor',
  description: 'Research a blog topic, generate template, and edit HTML',
  icon: Edit3,
  category: 'Blogging',
  difficulty: 'Beginner',
  nodes: [
    {
      id: 'd4e5f6a7-1234-4bcd-8ef0-abcdef123456', // blog_researcher
      title: 'Blog_Researcher',
      label: 'Enter blog topic or question',
      color: theme.colors.background,
      type: 'custom',
      description: 'Performs web research and summarizes findings for your blog topic',
      inputType: 'text',
      icon: FileText,
      position: { x: 100, y: 100 }
    },
    {
      id: 'f7e6d5c4-1234-4abc-9def-abcdef123456', // template_generator
      title: 'Template_Generator',
      label: 'Template Generator',
      color: theme.colors.background,
      type: 'custom',
      description: 'Fetches an HTML template from a URL and fills it with content using AI',
      inputType: 'file',
      icon: FileText,
      position: { x: 400, y: 100 }
    },
    {
      id: 'a8b9c0d1-2345-4def-8901-abcdef234567', // html_editor
      title: 'HTML_Editor',
      label: '',
      color: theme.colors.background,
      type: 'custom',
      description: 'Edit HTML content in a popup editor',
      inputType: 'html',
      icon: Edit3,
      position: { x: 700, y: 100 }
    }
  ],
  edges: [
    { id: 'e1', source: 'd4e5f6a7-1234-4bcd-8ef0-abcdef123456', target: 'f7e6d5c4-1234-4abc-9def-abcdef123456' },
    { id: 'e2', source: 'f7e6d5c4-1234-4abc-9def-abcdef123456', target: 'a8b9c0d1-2345-4def-8901-abcdef234567' }
  ]
});

const itUpdateEmailTemplate = (theme) => ({
  id: 'it-update-email-template',
  name: 'IT Update Email',
  description: 'Fetch IT tech news, summarize, and send to IT team',
  icon: Code,
  category: 'Technology',
  difficulty: 'Intermediate',
  nodes: [
    {
      id: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', // fetch_it_tech_news
      title: 'Fetch_IT_Tech_News',
      label: '',
      color: theme.colors.background,
      type: 'custom',
      description: 'Fetches latest tech news from major tech sources',
      icon: Code,
      position: { x: 100, y: 100 }
    },
    {
      id: '0ff35b88-681c-4c64-94b5-7b74dbfbb471', // summarize_html_content
      title: 'Summarize_HTML',
      label: '',
      color: theme.colors.background,
      type: 'custom',
      description: 'Get summary from AI models',
      icon: FileText,
      position: { x: 400, y: 100 }
    },
    {
      id: '1a7c2b8e-e4ae-4c8e-b2c4-999b4b3cf80d', // convert_to_html_template
      title: 'Convert_to_HTML_Template',
      label: '',
      color: theme.colors.background,
      type: 'custom',
      description: 'Transforms summary into email-ready HTML',
      icon: Mail,
      position: { x: 700, y: 100 }
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
      position: { x: 1000, y: 100 }
    }
  ],
  edges: [
    { id: 'e1', source: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', target: '0ff35b88-681c-4c64-94b5-7b74dbfbb471' },
    { id: 'e2', source: '0ff35b88-681c-4c64-94b5-7b74dbfbb471', target: '1a7c2b8e-e4ae-4c8e-b2c4-999b4b3cf80d' },
    { id: 'e3', source: '1a7c2b8e-e4ae-4c8e-b2c4-999b4b3cf80d', target: '6789d23f-1352-4b11-b9a3-2f4f6f96fcd0' }
  ]
});

// Template definitions
export const getTemplates = (theme) => [
  newsEmailTemplate(theme),
  itUpdateEmailTemplate(theme),
  blogHtmlTemplate(theme)
];

// Template categories
export const getTemplateCategories = (templates) => ({
  'Communication': templates.filter(t => t.category === 'Communication'),
  'Technology': templates.filter(t => t.category === 'Technology'),
  'Blogging': templates.filter(t => t.category === 'Blogging')
});