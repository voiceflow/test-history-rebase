import React from 'react';

import { BlockType } from '@/constants';
import { StepAPIProvider } from '@/pages/Canvas/components/Step/contexts';
import { ManagerContext, PlatformContext, useNode, useNodeData } from '@/pages/Canvas/contexts';

import { useNodeAPI, useNodeSubscription, useStepAPI } from '../hooks';
import NodePort from './NodePort';

export type NodeStepProps = {
  isLast: boolean;
};

const NodeStep: React.FC<NodeStepProps> = ({ isLast }) => {
  const stepRef = React.useRef<HTMLDivElement>(null);
  const { nodeID, node } = useNode();
  const { data } = useNodeData();
  const platform = React.useContext(PlatformContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const { step: StepComponent = getManager(BlockType.DEPRECATED).step } = getManager(data.type)!;
  const [isHighlighted, nodeAPI] = useNodeAPI(nodeID, stepRef);
  const stepAPI = useStepAPI(isHighlighted, isLast, stepRef);
  const [inPortID] = node.ports.in;

  const getAnchorPoint = React.useCallback(() => stepRef.current!.getBoundingClientRect(), []);

  useNodeSubscription(nodeID, node, nodeAPI);

  return (
    <>
      {inPortID && <NodePort portID={inPortID} getAnchorPoint={getAnchorPoint} />}
      <StepAPIProvider value={stepAPI}>
        <StepComponent node={node} data={data} platform={platform} />
      </StepAPIProvider>
    </>
  );
};

export default NodeStep;
