import React from 'react';

import Block from '@/pages/Canvas/components/Block/NewBlock';
import { EngineContext, NodeIDProvider, useNode, useNodeData } from '@/pages/Canvas/contexts';

import NodeStep from './NodeStep';

const NodeBlock = (_, ref) => {
  const { nodeID, node } = useNode();
  const { data } = useNodeData();
  const engine = React.useContext(EngineContext);
  const updateName = React.useCallback((name) => engine.node.updateData(nodeID, { name }), [engine, nodeID]);

  return (
    <Block name={data.name} updateName={updateName} canEditTitle ref={ref}>
      {node.combinedNodes.map((stepNodeID, index) => (
        <NodeIDProvider value={stepNodeID} key={stepNodeID}>
          <NodeStep isLast={index === node.combinedNodes.length - 1} />
        </NodeIDProvider>
      ))}
    </Block>
  );
};

export default React.forwardRef(NodeBlock);
