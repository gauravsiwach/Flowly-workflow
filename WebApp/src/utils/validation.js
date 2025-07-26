// Validation utilities for different node types

// URL validation for Fetch HTML Content node
export const validateUrl = (url) => {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'URL is required' };
  }
  
  let urlToValidate = url.trim();
  
  // Auto-add https:// if no protocol is provided
  if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
    urlToValidate = 'https://' + urlToValidate;
  }
  
  try {
    const urlObj = new URL(urlToValidate);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }
    
    // Check for proper domain structure
    const hostname = urlObj.hostname;
    if (!hostname || hostname.length === 0) {
      return { isValid: false, error: 'Please enter a valid domain name' };
    }
    
    // Check for at least one dot and proper domain structure
    const domainParts = hostname.split('.');
    if (domainParts.length < 2) {
      return { isValid: false, error: 'Please enter a complete domain name (e.g., example.com)' };
    }
    
    // Check that the last part (top-level domain) is at least 2 characters
    const topLevelDomain = domainParts[domainParts.length - 1];
    if (topLevelDomain.length < 2) {
      return { isValid: false, error: 'Please enter a complete domain name with top-level domain' };
    }
    
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

// Email validation for Send Email node
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email address is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: null };
};

// City name validation for Get Weather node
export const validateCityName = (cityName) => {
  if (!cityName || cityName.trim() === '') {
    return { isValid: false, error: 'City name is required' };
  }
  
  if (cityName.trim().length < 2) {
    return { isValid: false, error: 'City name must be at least 2 characters' };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const cityRegex = /^[a-zA-Z\s\-']+$/;
  if (!cityRegex.test(cityName.trim())) {
    return { isValid: false, error: 'City name contains invalid characters' };
  }
  
  return { isValid: true, error: null };
};

// Optional text validation for nodes that don't require input
export const validateOptionalText = (text) => {
  // Allow empty input
  if (!text || text.trim() === '') {
    return { isValid: true, error: null };
  }
  
  // If text is provided, ensure it's not too short
  if (text.trim().length < 1) {
    return { isValid: false, error: 'Text must be at least 1 character' };
  }
  
  return { isValid: true, error: null };
};

// Generic text validation for other nodes
export const validateText = (text, minLength = 1) => {
  if (!text || text.trim() === '') {
    return { isValid: false, error: 'This field is required' };
  }
  
  if (text.trim().length < minLength) {
    return { isValid: false, error: `Text must be at least ${minLength} character(s)` };
  }
  
  return { isValid: true, error: null };
};

// Main validation function that routes to specific validators based on node type
export const validateNodeInput = (nodeType, inputValue) => {
  switch (nodeType) {
    case '8c5a1f02-d0cd-4c6d-96b6-51f1bc1f0b17': // fetch_html_content
      return validateUrl(inputValue);
    
    case '6789d23f-1352-4b11-b9a3-2f4f6f96fcd0': // send_email
      return validateEmail(inputValue);
    
    case 'fdc3b924-2f2a-43e8-923f-3f118a51eb0e': // get_weather
      return validateCityName(inputValue);
    
    case 'a1b2c3d4-e5f6-7890-abcd-ef1234567890': // fetch_top_news
      return validateOptionalText(inputValue);
    
    case '0ff35b88-681c-4c64-94b5-7b74dbfbb471': // summarize_html_content
    case '1a7c2b8e-e4ae-4c8e-b2c4-999b4b3cf80d': // convert_to_html_template
      // These nodes don't have input fields, so always valid
      return { isValid: true, error: null };
    
    default:
      return validateText(inputValue);
  }
};

// Get validation rules for display
export const getValidationRules = (nodeType) => {
  switch (nodeType) {
    case '8c5a1f02-d0cd-4c6d-96b6-51f1bc1f0b17': // fetch_html_content
      return 'Enter URL (e.g., www.google.com or https://example.com)';
    
    case '6789d23f-1352-4b11-b9a3-2f4f6f96fcd0': // send_email
      return 'Enter a valid email address (e.g., user@example.com)';
    
    case 'fdc3b924-2f2a-43e8-923f-3f118a51eb0e': // get_weather
      return 'Enter a valid city name (letters, spaces, hyphens only)';
    
    case 'a1b2c3d4-e5f6-7890-abcd-ef1234567890': // fetch_top_news
      return 'Enter category (optional): technology, business, science, world, politics, or leave empty for general news';
    
    case '0ff35b88-681c-4c64-94b5-7b74dbfbb471': // summarize_html_content
    case '1a7c2b8e-e4ae-4c8e-b2c4-999b4b3cf80d': // convert_to_html_template
      return 'No input required';
    
    default:
      return 'Enter required text';
  }
};

// Validate all nodes in a workflow
export const validateAllNodes = (nodes) => {
  const validationResults = {
    isValid: true,
    errors: [],
    nodeErrors: {}
  };

  nodes.forEach(node => {
    const nodeId = node.id;
    const nodeData = node.data;
    const nodeType = nodeData.node_id;
    const inputValue = nodeData.additional_input?.[nodeData.title] || '';

    // Only validate nodes that have input fields and are not file inputs
    if (nodeData.inputType && nodeData.inputType !== 'file' && nodeData.inputType !== 'html') {
      const validation = validateNodeInput(nodeType, inputValue);
      
      if (!validation.isValid) {
        validationResults.isValid = false;
        validationResults.errors.push({
          nodeId,
          nodeTitle: nodeData.title,
          error: validation.error
        });
        validationResults.nodeErrors[nodeId] = validation.error;
      }
    }
  });

  return validationResults;
};

// Get validation summary for display
export const getValidationSummary = (validationResults) => {
  if (validationResults.isValid) {
    return {
      message: '✅ All nodes are valid!',
      type: 'success'
    };
  }

  const errorCount = validationResults.errors.length;
  return {
    message: `❌ ${errorCount} node${errorCount > 1 ? 's' : ''} have validation errors`,
    type: 'error',
    details: validationResults.errors.map(error => 
      `${error.nodeTitle}: ${error.error}`
    )
  };
}; 