import React from 'react';

import { BlockType } from '@/constants';
import { EngineContext, ManagerContext, useNode, useNodeData } from '@/pages/Canvas/contexts';

const NodeStep = () => {
  const { nodeID, node, isHighlighted } = useNode();
  const { data } = useNodeData();
  const getManager = React.useContext(ManagerContext);
  const { step: StepComponent } = getManager(data.type);
  const engine = React.useContext(EngineContext);

  const stepProps = { isActive: isHighlighted, onClick: () => engine.setActivation(nodeID) };

  if (!StepComponent) {
    const { step: DeprecatedStepComponent } = getManager(BlockType.DEPRECATED);

    return <DeprecatedStepComponent {...stepProps} />;
  }

  return <StepComponent node={node} data={data} stepProps={stepProps} />;
};

export default NodeStep;
