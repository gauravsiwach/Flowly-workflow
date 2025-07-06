import { Globe, Cloud, FileText, Mail, Send, Newspaper, Code, Clipboard } from 'lucide-react';

// Node definitions
export const getNodes = (theme) => [
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
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // fetch_top_news
    title: 'Fetch_Top_News',
    label: '',
    color: theme.colors.background,
    type: 'custom',
    description: 'Fetches latest news headlines from RSS feeds',
    icon: Newspaper,
  },
  {
    id: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', // fetch_it_tech_news
    title: 'Fetch_IT_Tech_News',
    label: '',
    color: theme.colors.background,
    type: 'custom',
    description: 'Fetches latest tech news from major tech sources',
    icon: Code,
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
  {
    id: 'e3b0c442-98fc-1c14-9afb-4c8996fb9242', // new guid for get_topic_content
    title: 'Get_Topic_Content',
    label: 'Enter Topic Name',
    color: theme.colors.background,
    type: 'custom',
    description: 'Get a topic name from the user and search for it on Google',
    inputType: 'text',
    icon: Clipboard,
  },
  {
    id: 'd4e5f6a7-1234-4bcd-8ef0-abcdef123456', // blog_researcher (new unique id)
    title: 'Blog_Researcher',
    label: 'Enter blog topic or question',
    color: theme.colors.background,
    type: 'custom',
    description: 'Performs web research and summarizes findings for your blog topic',
    inputType: 'text',
    icon: FileText,
    fields: [
      { name: 'input', label: 'Blog Topic/Question', type: 'text', required: true },
      { name: 'refURL', label: 'Reference Blog URL (optional)', type: 'text', required: false }
    ]
  },
  {
    id: 'f7e6d5c4-1234-4abc-9def-abcdef123456', // generate_html_from_template (unique id)
    title: 'Template_Generator',
    label: 'Template Generator',
    description: 'Fetches an HTML template from a URL and fills it with content using AI',
    type: 'custom',
    icon: FileText,
    fields: [
      { name: 'templateURL', label: 'Template URL', type: 'text', required: true }
    ]
  },
];

// Node categories
export const nodeCategories = {
  "Web & Data Collection": [
    "Fetch_HTML_Content",
    "Fetch_Top_News", 
    "Fetch_IT_Tech_News",
    "Get_Topic_Content"
  ],
  "AI & Processing": [
    "Summarize_HTML",
    "Blog_Researcher",
    "Template_Generator"
  ],
  "Communication & Output": [
    "Convert_to_HTML_Template",
    "Send_Email"
  ],
  "External Services": [
    "Get_Weather"
  ]
};