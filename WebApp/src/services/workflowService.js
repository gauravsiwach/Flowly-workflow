// Workflow service for handling all backend communication and workflow operations
const API_BASE_URL = 'http://localhost:8000';
                    
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

/**
 * Stream graph execution results from backend
 * @param {Object} graphData - The graph data to execute
 * @returns {AsyncGenerator<Object>} - Async generator yielding each streamed result as JSON
 */
export async function* streamGraphExecution(graphData) {
  const response = await fetch(`${API_BASE_URL}/run-graph-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphData),
  });
  if (!response.body) throw new Error('No response body for streaming');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let lines = buffer.split('\n');
    buffer = lines.pop(); // last line may be incomplete
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        yield JSON.parse(line);
      } catch (e) {
        console.error('Failed to parse streamed line:', line, e);
      }
    }
  }
} 