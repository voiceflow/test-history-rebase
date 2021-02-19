import React from 'react';

import Portal from '@/components/Portal';
import { BlockType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';
import * as Step from '@/pages/Canvas/components/Step';
import { StepAPIProvider } from '@/pages/Canvas/components/Step/contexts';
import { EngineContext, ManagerContext, NodeEntityContext, PlatformContext, PortEntityProvider } from '@/pages/Canvas/contexts';
import { buildVirtualDOMRect } from '@/utils/dom';

import NodeLifecycle from '../NodeLifecycle';
import NodePort from '../NodePort';
import { useNodeInstance, useStepAPI } from './hooks';
import Styles from './NodeStepStyles';

export type NodeStepProps = {
  isLast: boolean;
  variant: BlockVariant;
  isDraggable: boolean;
};

const NodeStep: React.FC<NodeStepProps> = ({ isLast, variant, isDraggable }) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const platform = React.useContext(PlatformContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const instance = useNodeInstance();
  const stepAPI = useStepAPI(instance.ref, isLast, isDraggable);
  const { node, data, isDragging } = nodeEntity.useState((e) => {
    const resolved = e.resolve();

    return {
      node: resolved.node,
      data: resolved.data,
      isDragging: e.isDragging,
    };
  });

  const getAnchorPoint = React.useCallback(() => {
    const { x, y } = instance.ref.current!.getBoundingClientRect();

    return buildVirtualDOMRect([x - LINK_WIDTH * engine.canvas!.getZoom(), y]);
  }, []);

  nodeEntity.useInstance(instance);

  React.useEffect(() => {
    engine.node.redrawNestedLinks(node.parentNode!);
  }, [data]);

  React.useEffect(() => {
    if (!isDragging) {
      engine.node.redrawLinks(nodeEntity.nodeID);
    }
  }, [isDragging]);

  const { platforms = [], ...manager } = getManager(nodeEntity.nodeType);
  let StepComponent = manager.step || getManager(BlockType.DEPRECATED).step;

  if (platforms.length && !platforms.includes(platform)) {
    StepComponent = getManager(BlockType.INVALID_PLATFORM).step;
  }

  return (
    <>
      <Styles isHovered={stepAPI.isHovered} hasLinkWarning={stepAPI.hasLinkWarning} />
      <NodeLifecycle />
      {nodeEntity.inPortID && (
        <PortEntityProvider id={nodeEntity.inPortID}>
          <NodePort getAnchorPoint={getAnchorPoint} />
        </PortEntityProvider>
      )}
      <StepAPIProvider value={stepAPI}>
        {isDragging ? (
          <>
            <Step.Placeholder variant={variant} isLast={isLast} />
            <Portal portalNode={engine.merge.components.mergeLayer!.ref.current!}>
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

export default React.memo(NodeStep);
