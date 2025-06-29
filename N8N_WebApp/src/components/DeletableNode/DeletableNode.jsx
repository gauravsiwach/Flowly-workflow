import React from 'react';
import { Handle, Position } from '@xyflow/react';

// This is a generic wrapper that adds handles to any node type.
// The delete functionality is now handled inside the CustomNode component.
export default function DeletableNode({ id, data, children, type }) {

  // Determine handle visibility based on node type
  const showSourceHandle = type !== 'output'; // Show for all except output nodes
  const showTargetHandle = type !== 'input';  // Show for all except input nodes

  return (
    <>
      {/* Conditionally render handles based on node type */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: '#555' }}
        />
      )}
      
      {/* The original node content is passed as children */}
      {children} 

      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: '#555' }}
        />
      )}
    </>
  );
} 