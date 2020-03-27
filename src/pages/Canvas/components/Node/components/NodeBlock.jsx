import React from 'react';

import Block from '@/pages/Canvas/components/Block/NewBlock';
import { EngineContext, NodeIDProvider, useNode, useNodeData } from '@/pages/Canvas/contexts';

import NodeStep from './NodeStep';

const NodeBlock = (_, ref) => {
  const { nodeID, node, lockOwner } = useNode();
  const { data } = useNodeData();
  const engine = React.useContext(EngineContext);
  const updateName = React.useCallback((name) => engine.node.updateData(nodeID, { name }), [engine, nodeID]);
  const updateBlockColor = React.useCallback((blockColor) => engine.node.updateData(nodeID, { blockColor }), [engine, nodeID]);

  return (
    <Block
      name={data.name}
      updateName={updateName}
      updateBlockColor={updateBlockColor}
      canEditTitle
      ref={ref}
      lockOwner={lockOwner}
      variant={data.blockColor}
    >
      {node.combinedNodes.map((stepNodeID, index) => (
        <NodeIDProvider value={stepNodeID} key={stepNodeID}>
          <NodeStep isLast={index === node.combinedNodes.length - 1} />
        </NodeIDProvider>
      ))}
    </Block>
  );
};

export default React.forwardRef(NodeBlock);
