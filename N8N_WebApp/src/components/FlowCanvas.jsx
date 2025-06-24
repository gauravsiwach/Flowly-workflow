import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import DeletableNode from './DeletableNode';
import { useTheme } from '../contexts/ThemeContext';

// Move ID counter outside component to prevent reset on re-renders
let globalId = 0;
const getId = () => `node_${globalId++}`;

const FlowCanvas = ({ nodes, setNodes, edges, setEdges, newNode, onDeleteNode }) => {
  const reactFlowInstance = useReactFlow();
  const nodeCountRef = useRef(0);
  const { theme, gridOpacity } = useTheme();
  
  // Memoize nodeTypes to prevent React Flow warning
  const nodeTypes = useMemo(() => {
    const withDeletable = (NodeComponent) => {
      return (props) => {
       // console.log('Wrapper called with props:', props.id, 'setNodes available:', !!setNodes);
        return (
          <DeletableNode {...props}>
            <NodeComponent {...props} setNodes={setNodes} />
          </DeletableNode>
        );
      };
    };

    return {
      custom: withDeletable(CustomNode),
      default: withDeletable(({ data }) => <div>{data.label}</div>),
      input: withDeletable(({ data }) => <div>{data.label}</div>),
      output: withDeletable(({ data }) => <div>{data.label}</div>),
    };
  }, [setNodes]);

  // Theme-based styling for React Flow
  const reactFlowStyle = {
    backgroundColor: theme.colors.flow.background,
  };

  const backgroundStyle = {
    backgroundColor: theme.colors.flow.background,
  };

  const controlsStyle = {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    boxShadow: theme.shadows.small,
  };

  const miniMapStyle = {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    boxShadow: theme.shadows.small,
  };

  const handleNodeInputChange = (id, inputValue) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
            ...node,
            data: {
              ...node.data,
                node_input: inputValue,
            },
          }
          : node
      )
    );
  };

  useEffect(() => {
    if (!newNode) return;

    // Determine node size based on whether it has an input field
    const hasInput = newNode.inputType !== undefined;
    const nodeWidth = hasInput ? 220 : 160;  // Updated to match CustomNode dimensions
    const nodeHeight = hasInput ? 120 : 80;  // Updated to match CustomNode dimensions

    // Calculate position with offset to prevent overlapping
    const basePosition = reactFlowInstance?.project?.({
      x: window.innerWidth / 2 - 200,
      y: window.innerHeight / 2 - 100,
    }) ?? { x: 100, y: 100 };
    
    // Add offset based on number of existing nodes
    const offset = nodeCountRef.current * 50;
    const position = {
      x: basePosition.x + offset,
      y: basePosition.y + offset
    };

    const newNodeObj = {
      id: getId(),
      type: newNode.type || 'default',
      position: position,
      style: {
        width: nodeWidth,
        height: nodeHeight,
      },
      data: {
        title: newNode.title || newNode.label,
        label: newNode.label || newNode.title,
        description: newNode.description || '',
        node_id: newNode.id,
        inputType: newNode.inputType,
        onChange: handleNodeInputChange,
        onDelete: onDeleteNode,
        node_input: '',
        node_result: null,
      },
    };

    setNodes((nds) => {
      const updatedNodes = [...nds, newNodeObj];
      nodeCountRef.current = updatedNodes.length;

      return updatedNodes;
    });
  }, [newNode, reactFlowInstance, setNodes, onDeleteNode]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const updated = addEdge(params, eds);
        return updated;
      });
    },
    [setEdges]
  );

  return (
    <div style={{ 
      flex: 1, 
      height: '100%',
      backgroundColor: theme.colors.flow.background,
    }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        panOnDrag={true}
        zoomOnScroll={true}
        preventScrolling={true}
        attributionPosition="bottom-left"
        style={{
          backgroundColor: theme.colors.flow.background,
        }}
        defaultEdgeOptions={{
          style: { stroke: theme.colors.flow.edge, strokeWidth: 2 },
          animated: false,
        }}
        connectionLineStyle={{ stroke: theme.colors.flow.edge, strokeWidth: 2 }}
        selectionKeyCode="Shift"
        multiSelectionKeyCode="Ctrl"
        deleteKeyCode="Delete"
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background 
          color={theme.colors.text.secondary}
          gap={20}
          size={2}
          style={{
            backgroundColor: theme.colors.flow.background,
            opacity: gridOpacity / 100, // Convert percentage to decimal
          }}
          variant="dots"
        />
        <Controls 
          style={controlsStyle}
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        <MiniMap 
          style={miniMapStyle}
          nodeColor={theme.colors.flow.nodeSelected}
          maskColor={theme.colors.flow.pattern}
        />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
