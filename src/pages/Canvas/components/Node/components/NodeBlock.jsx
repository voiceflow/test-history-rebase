import React from 'react';

import Block from '@/pages/Canvas/components/Block/NewBlock';
import { NodeIDProvider, useNode, useNodeData } from '@/pages/Canvas/contexts';

import NodeStep from './NodeStep';

const NodeBlock = (_, ref) => {
  const blockRef = React.useRef();
  const { node } = useNode();
  const { data } = useNodeData();

  React.useImperativeHandle(
    ref,
    () => ({
      api: {
        getBoundingClientRect: () => blockRef.current.getBoundingClientRect(),
      },
    }),
    []
  );

  return (
    <Block name={data.name} ref={blockRef}>
      {node.combinedNodes.map((nodeID) => (
        <NodeIDProvider value={nodeID} key={nodeID}>
          <NodeStep />
        </NodeIDProvider>
      ))}
    </Block>
  );
};

export default React.forwardRef(NodeBlock);
