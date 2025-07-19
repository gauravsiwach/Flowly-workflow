import React, { useState, useRef, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import FlowCanvas from './components/FlowCanvas/FlowCanvas';
import ConfigPanel from './components/ConfigPanel/ConfigPanel';
import LandingPage from './pages/LandingPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { validateAllNodes, getValidationSummary } from './utils/validation';
import { executeGraph, processApiResults, streamGraphExecution } from './services/workflowService';
import { APP_NAME } from './utils/constants';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Modal from './components/Modal/Modal';
import { FolderOpen, Trash2, Search } from 'lucide-react';
import { API_BASE_URL } from './config_definitions/api_config';

// Landing Page Component
function LandingPageComponent() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/app');
  };

  return <LandingPage onGetStarted={handleGetStarted} />;
}

// App Page Component (Workflow Builder)
function AppPageComponent() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [newNode, setNewNode] = useState(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const { user } = useAuth();
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [savedWorkflows, setSavedWorkflows] = useState([]);
  const [isLoadingWorkflows, setIsLoadingWorkflows] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleAddNode = useCallback((nodeData) => {
    setNewNode(nodeData);
    setTimeout(() => setNewNode(null), 100);
  }, []);

  const handleValidateFlow = useCallback(async () => {
    if (nodes.length === 0) {
      toast.warning("⚠️ No nodes to validate");
      return;
    }
    // console.log('handleValidateFlow: Starting execution, setting isExecuting to true');
    setIsExecuting(true);
    try {
      // First, validate all nodes
      const validationResults = validateAllNodes(nodes);
      const validationSummary = getValidationSummary(validationResults);

      if (!validationResults.isValid) {
        setNodes(currentNodes => {
          return currentNodes.map(node => {
            const nodeError = validationResults.nodeErrors[node.id];
            if (nodeError) {
              return {
                ...node,
                data: {
                  ...node.data,
                  validationError: nodeError,
                  isLoading: false, // stop loader if validation fails
                }
              };
            }
            return node;
          });
        });
        setIsExecuting(false);
        return;
      }

      // Set isLoading: true for all nodes only after validation passes
      setNodes(currentNodes =>
        currentNodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            isLoading: true,
          }
        }))
      );

      let executionList = [];

      if (edges.length > 0) {
        const sequence = edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          return { from: sourceNode.data, to: targetNode.data };
        });
        executionList = getOrderedNodeListWithSeq(sequence);
      } else {
        executionList = nodes.map((node, index) => ({
          node_id: node.data.node_id,
          seq: index + 1,
          node_input: node.data.additional_input?.[node.data.title] || undefined,
          node_name: node.data.title,
          node_result: "",
        }));
      }

      if (executionList.length === 0 && nodes.length > 0) {
        toast.warning("⚠️ No valid execution list generated");
        // stop loader for all nodes
        setNodes(currentNodes =>
          currentNodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              isLoading: false,
            }
          }))
        );
        return;
      }

      // Build additional_input array for backend
      const additional_input = nodes.map(node => ({
        node_id: node.data.node_id,
        node_input: node.data.additional_input?.[node.data.title] || ''
      }));

      // console.log('handleValidateFlow: Sending API request');
      // Send both graph_flowData and additional_input in the payload
      const apiResults = await executeGraph({
        graph_flowData: executionList,
        additional_input
      });
      // console.log('handleValidateFlow: API response received');
      
      const { resultsArray, additionalInputArray } = processApiResults(apiResults);
      
      if (resultsArray) {
        setNodes(currentNodes =>
          currentNodes.map(node => {
            // Find result for this node
            const resultObj = resultsArray.find(r => r.node_id === node.data.node_id);
            // Find input for this node from additional_input
            const inputObj = additionalInputArray.find(ai => ai.node_id === node.data.node_id);

            return {
              ...node,
              data: {
                ...node.data,
                node_result: resultObj ? resultObj.node_result : node.data.node_result,
                isLoading: false, // stop loader for this node
                additional_input: {
                  ...node.data.additional_input,
                  [node.data.title]: inputObj ? inputObj.node_input : (node.data.additional_input?.[node.data.title] || '')
                },
              },
            };
          })
        );
      }
    } catch (error) {
      console.error('❌ Flow execution error:', error);
      toast.error("❌ Failed to execute flow");
    } finally {
      // console.log('handleValidateFlow: Execution complete, setting isExecuting to false');
      setIsExecuting(false);
    }
  }, [nodes, edges]);

  const handleValidateFlowStream = useCallback(async () => {
    if (nodes.length === 0) {
      toast.warning("⚠️ No nodes to validate");
      return;
    }
    setIsExecuting(true);
    try {
      // First, validate all nodes (same as handleValidateFlow)
      const validationResults = validateAllNodes(nodes);
      const validationSummary = getValidationSummary(validationResults);

      if (!validationResults.isValid) {
        setNodes(currentNodes => {
          return currentNodes.map(node => {
            const nodeError = validationResults.nodeErrors[node.id];
            if (nodeError) {
              return {
                ...node,
                data: {
                  ...node.data,
                  validationError: nodeError,
                  isLoading: false, // stop loader if validation fails
                }
              };
            }
            return node;
          });
        });
        setIsExecuting(false);
        return;
      }

      // Set isLoading: true for all nodes only after validation passes
      setNodes(currentNodes =>
        currentNodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            isLoading: true,
          }
        }))
      );

      let executionList = [];
      if (edges.length > 0) {
        const sequence = edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          return { from: sourceNode.data, to: targetNode.data };
        });
        executionList = getOrderedNodeListWithSeq(sequence);
      } else {
        executionList = nodes.map((node, idx) => ({
          node_id: node.data.node_id,
          seq: idx + 1,
          node_input: node.data.additional_input?.[node.data.title] || "",
          node_name: node.data.title,
          node_result: ""
        }));
      }
      const additionalInput = nodes.map(node => ({
        node_id: node.data.node_id,
        node_input: node.data.additional_input?.[node.data.title] || ''
      }));
      const payload = {
        graph_flowData: executionList,
        additional_input: additionalInput,
      };
      // Use the new streaming service
      for await (const data of streamGraphExecution(payload)) {
        if (data.results && data.results.node_id) {
          setNodes(currentNodes =>
            currentNodes.map(node => {
              if (node.data.node_id === data.results.node_id) {
                const inputObj = (data.additional_input || []).find(ai => ai.node_id === node.data.node_id);
                return {
                  ...node,
                  data: {
                    ...node.data,
                    node_result: data.results.node_result,
                    isLoading: false,
                    additional_input: {
                      ...node.data.additional_input,
                      [node.data.title]: inputObj ? inputObj.node_input : (node.data.additional_input?.[node.data.title] || '')
                    }
                  }
                };
              }
              return node;
            })
          );
        }
      }
      setIsExecuting(false);
    } catch (error) {
      setIsExecuting(false);
      toast.error('❌ Stream validation failed');
      console.error('Stream validation error:', error);
    }
  }, [nodes, edges, toast]);

  const handleDeleteNode = useCallback((nodeIdToRemove) => {
    setNodes((currentNodes) => {
      const filteredNodes = currentNodes.filter((node) => node.id !== nodeIdToRemove);
      return filteredNodes;
    });

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
      const filteredEdges = currentEdges.filter(
        (edge) => edge.source !== nodeIdToRemove && edge.target !== nodeIdToRemove
      );
      return filteredEdges;
    });
  }, [setNodes, setEdges]);

  const handleNodeInputChange = useCallback((id, inputValue) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                additional_input: {
                  ...node.data.additional_input,
                  [node.data.title]: inputValue
                }
              },
            }
          : node
      )
    );
  }, [setNodes]);

  const handleClear = useCallback(() => {
    // Clear all nodes and edges
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const handleImport = useCallback((data) => {
    // Handle importing additional nodes/edges
    if (data.nodes) {
      // Ensure imported nodes have the onDelete function
      const nodesWithDelete = data.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onDelete: handleDeleteNode,
          onChange: handleNodeInputChange
        }
      }));
      
      // Add imported nodes to the current flow
      setNodes(prevNodes => [...prevNodes, ...nodesWithDelete]);
      if (data.edges) {
        setEdges(prevEdges => [...prevEdges, ...data.edges]);
      }
      toast.success("✅ Flow imported successfully!");
    } else {
      toast.error("❌ Invalid import file format");
    }
  }, [setNodes, setEdges, handleDeleteNode, handleNodeInputChange]);

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
        description: `${APP_NAME} Export`,
        nodeTypes: [...new Set(currentNodes.map(node => node.data.title))],
      }
    };

    // Remove the export toast here to avoid double toast on save
    // toast.success("✅ Flow exported successfully!");
    return exportData;
  }, [nodes, edges]);

  const handleLoadTemplate = useCallback((template) => {
    // Clear current flow
    setNodes([]);
    setEdges([]);
    
    // Generate unique IDs for the template nodes
    const nodeIdMap = {};
    const templateNodes = template.nodes.map((node, index) => {
      const newId = `node_${Date.now()}_${index}`;
      nodeIdMap[node.id] = newId;
      
      return {
        id: newId,
        type: node.type,
        position: node.position,
        style: {
          width: node.inputType ? 220 : 160,
          height: node.inputType ? 120 : 80,
        },
        data: {
          title: node.title,
          label: node.label,
          description: node.description,
          node_id: node.id,
          inputType: node.inputType,
          onChange: handleNodeInputChange,
          onDelete: handleDeleteNode,
          additional_input: {},
          node_result: null,
        },
      };
    });

    // Generate edges with new node IDs
    const templateEdges = template.edges.map((edge, index) => ({
      id: `edge_${Date.now()}_${index}`,
      source: nodeIdMap[edge.source],
      target: nodeIdMap[edge.target],
    }));

    // Set the template nodes and edges
    setNodes(templateNodes);
    setEdges(templateEdges);
  }, [setNodes, setEdges, handleNodeInputChange, handleDeleteNode]);

  const handleSave = useCallback(() => {
    if (nodes.length === 0) {
      toast.warning('⚠️ No nodes to save');
      return;
    }
    setIsSaveModalOpen(true);
  }, [nodes]);

  const handleSaveWorkflow = async () => {
    if (nodes.length === 0) {
      toast.warning('⚠️ No nodes to save');
      setIsSaveModalOpen(false);
      return;
    }
    if (!workflowName.trim()) return;
    // Prepare workflow data
    const exportData = handleExport();
    if (!exportData) return;
    // Send to backend
    try {
      const token = localStorage.getItem('flowly_jwt_token');
      const response = await fetch(`${API_BASE_URL}/user/save-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: workflowName,
          data: exportData,
        })
      });
      if (!response.ok) throw new Error('Failed to save workflow');
      toast.success('✅ Workflow saved!');
      setIsSaveModalOpen(false);
      setWorkflowName('');
    } catch (e) {
      toast.error('❌ Failed to save workflow');
    }
  };

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
        node_input: node.additional_input?.[node.title] || undefined,
        node_name: node.title.replace(/ /g, '_'),
        node_result: "",
      });
      visited.add(startId);
      startId = nextMap[startId];
      seq++;
    }

    return orderedNodes;
  };

  // Fetch saved workflows from backend
  const fetchSavedWorkflows = async () => {
    setIsLoadingWorkflows(true);
    setLoadError(null);
    try {
      const token = localStorage.getItem('flowly_jwt_token');
      const response = await fetch(`${API_BASE_URL}/user/list-workflows`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch workflows');
      const data = await response.json();
      setSavedWorkflows(data.workflows || []);
    } catch (e) {
      setLoadError('Failed to load workflows');
      setSavedWorkflows([]);
    } finally {
      setIsLoadingWorkflows(false);
    }
  };

  const handleOpen = useCallback(() => {
    setIsOpenModalOpen(true);
    setSearchTerm(""); // Clear search box on open
    fetchSavedWorkflows();
  }, []);

  const handleLoadWorkflow = (workflow) => {
    if (!workflow || !workflow.data) return;
    const { nodes: loadedNodes, edges: loadedEdges } = workflow.data;
    if (!Array.isArray(loadedNodes) || !Array.isArray(loadedEdges)) {
      toast.error('❌ Invalid workflow data');
      return;
    }
    // Re-attach handlers to each node
    const nodesWithHandlers = loadedNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onDelete: handleDeleteNode,
        onChange: handleNodeInputChange,
      }
    }));
    setNodes(nodesWithHandlers);
    setEdges(loadedEdges);
    setIsOpenModalOpen(false);
    toast.success(`✅ Loaded: ${workflow.name}`);
  };

  // Delete a workflow by ID
  const handleDeleteWorkflow = async (workflowId) => {
    if (!window.confirm('Are you sure you want to delete this workflow? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('flowly_jwt_token');
      const response = await fetch(`${API_BASE_URL}/user/delete-workflow/${workflowId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete workflow');
      setSavedWorkflows((prev) => prev.filter(wf => wf.workflow_id !== workflowId));
      toast.success('✅ Workflow deleted');
    } catch (e) {
      toast.error('❌ Failed to delete workflow');
    }
  };

  // Filtered workflows for search
  const filteredWorkflows = savedWorkflows.filter(wf =>
    wf.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        onSave={handleSave}
        onOpen={handleOpen}
        disableSave={nodes.length === 0}
        onImport={handleImport}
        onExport={handleExport}
        onValidate={handleValidateFlow}
        onClear={handleClear}
        onValidateStream={handleValidateFlowStream}
        onBackToHome={handleBackToHome}
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
            isExecuting={isExecuting}
          />
        </div>
      </div>
      
      <Sidebar 
        onAddNode={handleAddNode}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onLoadTemplate={handleLoadTemplate}
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

      <Modal
        isOpen={isSaveModalOpen}
        title="Save Workflow"
        onClose={() => setIsSaveModalOpen(false)}
        onSubmit={handleSaveWorkflow}
        submitLabel="Save"
        disabled={nodes.length === 0}
        // No fixed height or scroll for Save modal
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500 }}>Workflow Name</label>
          <input
            type="text"
            value={workflowName}
            onChange={e => setWorkflowName(e.target.value)}
            placeholder="Enter workflow name"
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 8 }}
            autoFocus
          />
        </div>
      </Modal>
      <Modal
        isOpen={isOpenModalOpen}
        title="Open Workflow"
        onClose={() => setIsOpenModalOpen(false)}
        onSubmit={() => setIsOpenModalOpen(false)}
        submitLabel="Close"
        modalWidth={480}
        contentHeight={500}
        scrollableContent={true}
      >
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Search size={18} style={{ color: theme.colors.text.secondary }} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search workflows by name..."
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 6,
              border: `1px solid ${theme.colors.border}`,
              fontSize: 14,
              background: theme.colors.background,
              color: theme.colors.text.primary,
            }}
          />
        </div>
        {isLoadingWorkflows ? (
          <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>
        ) : loadError ? (
          <div style={{ color: 'red', padding: 24 }}>{loadError}</div>
        ) : filteredWorkflows.length === 0 ? (
          <div style={{ padding: 24, color: theme.colors.text.secondary }}>No saved workflows found.</div>
        ) : (
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {filteredWorkflows.map(wf => (
              <div key={wf.workflow_id} style={{
                padding: '12px 0',
                borderBottom: `1px solid ${theme.colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}>
                <div>
                  <div style={{ fontWeight: 500, color: theme.colors.text.primary }}>{wf.name}</div>
                  <div style={{ fontSize: 12, color: theme.colors.text.secondary }}>{new Date(Number(wf.created_at) * 1000).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    title="Load"
                    style={{
                      background: theme.colors.button.primary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => handleLoadWorkflow(wf)}
                  >
                    <FolderOpen size={18} />
                  </button>
                  <button
                    title="Delete"
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => handleDeleteWorkflow(wf.workflow_id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

// Main App Content with Routes
function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<LandingPageComponent />} />
      <Route path="/app" element={<AppPageComponent />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider 
        clientId="990688959705-cpefpm71e76dr5381cr0k8qvakld8h05.apps.googleusercontent.com"
        onScriptLoadError={() => {
          console.error('Google OAuth script failed to load');
        }}
      >
        <AuthProvider>
          <ThemeProvider>
            <ReactFlowProvider>
              <AppContent />
            </ReactFlowProvider>
          </ThemeProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}
