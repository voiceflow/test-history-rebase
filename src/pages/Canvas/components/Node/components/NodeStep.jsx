import React from 'react';

import { BlockType } from '@/constants';
import { EngineContext, ManagerContext, PlatformContext, useNode, useNodeData } from '@/pages/Canvas/contexts';

const NodeStep = ({ isLast }) => {
  const { nodeID, node, isHighlighted } = useNode();
  const { data } = useNodeData();
  const platform = React.useContext(PlatformContext);
  const getManager = React.useContext(ManagerContext);
  const engine = React.useContext(EngineContext);
  const { step: StepComponent } = getManager(data.type);

  const stepProps = {
    isActive: isHighlighted,
    withPorts: isLast,
    onClick: () => engine.setActivation(nodeID),
  };

  if (!StepComponent) {
    const { step: DeprecatedStepComponent } = getManager(BlockType.DEPRECATED);

    return <DeprecatedStepComponent {...stepProps} />;
  }

  return <StepComponent node={node} data={data} stepProps={stepProps} platform={platform} />;
};

export default NodeStep;
