// Workflow service for handling all backend communication and workflow operations
const API_BASE_URL = 'http://localhost:9000';

/**
 * Send graph data to backend for execution
 * @param {Object} graphData - The graph data to execute
 * @returns {Promise<Object>} - API response
 */
export const executeGraph = async (graphData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/run-graph`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Response:', data);
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};

/**
 * Validate graph data structure
 * @param {Object} graphData - The graph data to validate
 * @returns {boolean} - Whether the data is valid
 */
export const validateGraphData = (graphData) => {
  if (!graphData || typeof graphData !== 'object') {
    return false;
  }
  
  if (!graphData.graph_flowData || !Array.isArray(graphData.graph_flowData)) {
    return false;
  }
  
  return true;
};

/**
 * Process API results and extract node results
 * @param {Object} apiResults - Raw API response
 * @returns {Object} - Processed results with resultsArray and additionalInputArray
 */
export const processApiResults = (apiResults) => {
  let resultsArray = apiResults;
  let additionalInputArray = [];
  
  if (apiResults && apiResults.result) {
    if (apiResults.result.results) {
      resultsArray = apiResults.result.results;
      additionalInputArray = apiResults.result.additional_input || [];
    } else {
      resultsArray = apiResults.result;
    }
  }
  
  // Handle string results that need parsing
  if (typeof resultsArray === 'string') {
    resultsArray = resultsArray
      .split(/}\s*{/) // split on }{
      .map((chunk, idx, arr) => {
        if (arr.length === 1) return JSON.parse(chunk);
        if (idx === 0) return JSON.parse(chunk + '}');
        if (idx === arr.length - 1) return JSON.parse('{' + chunk);
        return JSON.parse('{' + chunk + '}');
      });
  }
  
  if (!Array.isArray(resultsArray)) {
    resultsArray = [resultsArray];
  }
  
  return { resultsArray, additionalInputArray };
}; 