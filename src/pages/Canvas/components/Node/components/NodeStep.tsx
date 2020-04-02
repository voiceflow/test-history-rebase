import React from 'react';

import Portal from '@/components/Portal';
import { BlockType } from '@/constants';
import { LINK_WIDTH } from '@/pages/Canvas/components/PortV2/constants';
import * as Step from '@/pages/Canvas/components/Step';
import { StepAPIProvider } from '@/pages/Canvas/components/Step/contexts';
import { EngineContext, ManagerContext, PlatformContext, useNode, useNodeData } from '@/pages/Canvas/contexts';
import { buildVirtualDOMRect } from '@/utils/dom';

import { useNodeLifecycle } from '../hocs';
import { useNodeAPI, useNodeSubscription, useStepAPI } from '../hooks';
import NodePort from './NodePort';

export type NodeStepProps = {
  isLast: boolean;
  isDraggable: boolean;
};

const NodeStep: React.FC<NodeStepProps> = ({ isLast, isDraggable }) => {
  const stepRef = React.useRef<HTMLDivElement>(null);
  const { nodeID, node } = useNode();
  const { data } = useNodeData();
  const platform = React.useContext(PlatformContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const engine = React.useContext(EngineContext)!;
  const { step: StepComponent = getManager(BlockType.DEPRECATED).step } = getManager(node?.type)!;
  const nodeAPI = useNodeAPI(nodeID, stepRef);
  const stepAPI = useStepAPI(nodeAPI.isHighlighted, isLast, isDraggable, stepRef);
  const [inPortID] = node?.ports?.in || [];

  const getAnchorPoint = React.useCallback(() => {
    const { x, y } = stepRef.current!.getBoundingClientRect();

    return buildVirtualDOMRect([x - LINK_WIDTH * engine.canvas.getZoom(), y]);
  }, []);

  React.useEffect(() => {
    engine.node.redrawNestedLinks(node.parentNode!);
  }, [data]);

  useNodeLifecycle();
  useNodeSubscription(nodeID, nodeAPI);

  if (!node) return null;

  return (
    <>
      {inPortID && <NodePort portID={inPortID} getAnchorPoint={getAnchorPoint} />}
      <StepAPIProvider value={stepAPI}>
        {nodeAPI.isDragging ? (
          <>
            <Step.Placeholder />
            <Portal portalNode={engine.mergeV2.mergeLayer!.ref.current!}>
              <StepComponent node={node} data={data} platform={platform} withPorts={stepAPI.withPorts} />
            </Portal>
          </>
        ) : (
          <StepComponent node={node} data={data} platform={platform} withPorts={stepAPI.withPorts} />
        )}
      </StepAPIProvider>
    </>
  );
};

export default NodeStep;
