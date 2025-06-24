import React, { useState, useRef, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FlowCanvas from './components/FlowCanvas';
import ConfigPanel from './components/ConfigPanel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { validateAllNodes, getValidationSummary } from './utils/validation';

function AppContent() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [newNode, setNewNode] = useState(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();

  const handleAddNode = useCallback((nodeData) => {
    setNewNode(nodeData);
    setTimeout(() => setNewNode(null), 100);
  }, []);

  const sendGraphData = async (graphData) => {
    try {
      const res = await fetch('http://localhost:9000/run-graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ graph_flowData: graphData }),
      });

      const data = await res.json();
      console.log('✅ API Response:', data);
      toast.success("✅ Flow executed successfully!");
      return data;
    } catch (error) {
      console.error('❌ Fetch error:', error);
      toast.error("❌ Failed to execute flow");
      return null;
    }
  };

  const handleValidateFlow = useCallback(async () => {
    if (nodes.length === 0) {
      toast.warning("⚠️ No nodes to validate");
      return;
    }

    // First, validate all nodes
    const validationResults = validateAllNodes(nodes);
    const validationSummary = getValidationSummary(validationResults);

    if (!validationResults.isValid) {
      // Show validation errors
      //toast.error(validationSummary.message);
      
      // Show detailed errors in console for debugging
      //console.log('Validation Errors:', validationResults.errors);
      
      // Update nodes to show validation errors
      setNodes(currentNodes => {
        return currentNodes.map(node => {
          const nodeError = validationResults.nodeErrors[node.id];
          if (nodeError) {
            return {
              ...node,
              data: {
                ...node.data,
                validationError: nodeError
              }
            };
          }
          return node;
        });
      });

      return; // Stop execution if validation fails
    }

    // If validation passes, proceed with execution
    //toast.success(validationSummary.message);
    //console.log('✅ All nodes validated successfully');

    let executionList = [];

    // If there are edges, use the existing logic to create a sequence
    if (edges.length > 0) {
      const sequence = edges.map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        return { from: sourceNode.data, to: targetNode.data };
      });
      executionList = getOrderedNodeListWithSeq(sequence);
    } else {
      // If no edges, execute all nodes individually
      executionList = nodes.map((node, index) => ({
        node_id: node.data.node_id,
        seq: index + 1,
        node_input: node.data.node_input || undefined,
        node_name: node.data.title,
        node_result: "",
      }));
    }

    if (executionList.length === 0 && nodes.length > 0) {
      toast.warning("⚠️ No valid execution list generated");
      return;
    }

    console.log('Final Execution List:', executionList);
    //toast.info("🚀 Executing workflow...");

    const apiResults = await sendGraphData(executionList);
    let resultsArray = apiResults;
    if (apiResults && apiResults.result) {
      resultsArray = apiResults.result;
    }
    if (resultsArray) {
      if (typeof resultsArray === 'string') {
        // Try to split and parse if backend returns concatenated JSON objects
        resultsArray = resultsArray
          .split(/}\s*{/)
          .map((chunk, idx, arr) => {
            if (arr.length === 1) return JSON.parse(chunk);
            if (idx === 0) return JSON.parse(chunk + '}');
            if (idx === arr.length - 1) return JSON.parse('{' + chunk);
            return JSON.parse('{' + chunk + '}');
          });
      }
      if (!Array.isArray(resultsArray)) resultsArray = [resultsArray];
      setNodes(currentNodes =>
        currentNodes.map(node => {
          const found = resultsArray.find(r => r.node_id === node.data.node_id);
          if (found) {
            return {
              ...node,
              data: {
                ...node.data,
                node_result: found.node_result,
                node_input: found.node_input,
              },
            };
          }
          return node;
        })
      );
    }
  }, [nodes, edges]);

  const handleDeleteNode = useCallback((nodeIdToRemove) => {
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== nodeIdToRemove));

    setEdges((currentEdges) => {
      const incomingEdge = currentEdges.find((edge) => edge.target === nodeIdToRemove);
      const outgoingEdge = currentEdges.find((edge) => edge.source === nodeIdToRemove);

      if (incomingEdge && outgoingEdge) {
        const predecessorId = incomingEdge.source;
        const successorId = outgoingEdge.target;
        
        const filteredEdges = currentEdges.filter(
          (edge) => edge.id !== incomingEdge.id && edge.id !== outgoingEdge.id
        );

        const newEdge = {
          id: `e-${predecessorId}-${successorId}`,
          source: predecessorId,
          target: successorId,
        };

        return [...filteredEdges, newEdge];
      }

      // If not a chain, just remove connected edges
      return currentEdges.filter(
        (edge) => edge.source !== nodeIdToRemove && edge.target !== nodeIdToRemove
      );
    });
  }, [setNodes, setEdges]);

  const handleOpen = useCallback((data) => {
    // Handle opening a saved flow
    if (data.nodes && data.edges) {
      // Update the flow canvas with the loaded data
      setNodes(data.nodes);
      setEdges(data.edges);
      toast.success("✅ Flow loaded successfully!");
    } else {
      toast.error("❌ Invalid flow file format");
    }
  }, [setNodes, setEdges]);

  const handleImport = useCallback((data) => {
    // Handle importing additional nodes/edges
    if (data.nodes) {
      // Add imported nodes to the current flow
      // This simple version replaces existing nodes, a merge would be more complex
      setNodes(prevNodes => [...prevNodes, ...data.nodes]);
      toast.success("✅ Flow imported successfully!");
    } else {
      toast.error("❌ Invalid import file format");
    }
  }, [setNodes]);

  const handleExport = useCallback(() => {
    // Export current flow data
    const currentNodes = nodes;
    const currentEdges = edges;
    
    if (currentNodes.length === 0) {
      toast.warning("⚠️ No nodes to export");
      return null;
    }

    const exportData = {
      nodes: currentNodes,
      edges: currentEdges,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        nodeCount: currentNodes.length,
        edgeCount: currentEdges.length,
      }
    };

    //toast.success("✅ Flow exported successfully!");
    return exportData;
  }, [nodes, edges]);

  const getOrderedNodeListWithSeq = (edges) => {
    const nodeMap = {};
    const nextMap = {};
    const prevMap = {};

    // Use the `data` object directly
    edges.forEach(({ from, to }) => {
      nodeMap[from.node_id] = from;
      nodeMap[to.node_id] = to;
      nextMap[from.node_id] = to.node_id;
      prevMap[to.node_id] = from.node_id;
    });

    const allNodeIds = Object.keys(nodeMap);
    let startId = allNodeIds.find(id => !prevMap[id]);

    const visited = new Set();
    const orderedNodes = [];
    let seq = 1;

    while (startId && !visited.has(startId)) {
      const node = nodeMap[startId];
      orderedNodes.push({
        node_id: node.node_id,
        seq,
        node_input: node.node_input || undefined,
        node_name: node.title.replace(/ /g, '_'),
        node_result: "",
      });
      visited.add(startId);
      startId = nextMap[startId];
      seq++;
    }

    return orderedNodes;
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: theme.colors.background,
      color: theme.colors.text.primary,
      transition: 'all 0.3s ease'
    }}>
      <Header 
        onSave={()=>{}}
        onOpen={handleOpen}
        onImport={handleImport}
        onExport={handleExport}
        onValidate={handleValidateFlow}
      />
      
      <div style={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden'
      }}>
        <div style={{
          flex: 1,
          marginLeft: isSidebarOpen ? '280px' : '0',
          marginRight: isConfigPanelOpen ? '400px' : '0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <FlowCanvas
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            newNode={newNode}
            onDeleteNode={handleDeleteNode}
          />
        </div>
      </div>
      
      <Sidebar 
        onAddNode={handleAddNode}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <ConfigPanel 
        isOpen={isConfigPanelOpen}
        onToggle={() => setIsConfigPanelOpen(!isConfigPanelOpen)}
      />
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme={theme.name === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <AppContent />
      </ReactFlowProvider>
    </ThemeProvider>
  );
}
