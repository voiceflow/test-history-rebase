import type * as Realtime from '@voiceflow/realtime-sdk';
import { Portal } from '@voiceflow/ui';
import React from 'react';

import type { HSLShades } from '@/constants';
import { BlockType } from '@/constants';
import { useActiveProjectConfig } from '@/hooks';
import * as Step from '@/pages/Canvas/components/Step';
import { StepAPIProvider } from '@/pages/Canvas/components/Step/contexts';
import { EngineContext, ManagerContext, NodeEntityContext, PortEntityProvider } from '@/pages/Canvas/contexts';

import NodeLifecycle from '../NodeLifecycle';
import NodePort from '../NodePort';
import Styles from '../NodeStepStyles';
import { useNodeInstance, useStepAPI } from './hooks';

export interface NodeStepProps {
  isLast: boolean;
  palette: HSLShades;
  isDraggable: boolean;
}

const NodeStep: React.FC<NodeStepProps> = ({ isLast, palette, isDraggable }) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const { nlu, platform, projectType } = useActiveProjectConfig();

  const instance = useNodeInstance();
  const { node, data, isDragging } = nodeEntity.useState((e) => {
    const resolved = e.resolve();

    return {
      node: resolved.node,
      data: resolved.data,
      isDragging: e.isDragging,
    };
  });

  const getAnchorPoint = React.useCallback(() => instance.ref.current?.getBoundingClientRect() ?? null, []);

  const hasPort = isLast || node.type === 'carousel' || node.type === 'cardV2' || node.type === 'function';

  const stepAPI = useStepAPI(instance.ref, hasPort, isDraggable, getAnchorPoint);

  nodeEntity.useInstance(instance);

  React.useEffect(() => {
    engine.node.redrawNestedLinks(node.parentNode);
  }, [data]);

  React.useEffect(() => {
    if (!isDragging) {
      engine.node.redrawLinks(nodeEntity.nodeID);
    }
  }, [isDragging]);

  const { platforms = [], projectTypes = [], ...manager } = getManager(nodeEntity.nodeType as Realtime.StepBlockType);
  let StepComponent = manager.step || getManager(BlockType.DEPRECATED).step;

  if (
    (platforms.length && !platforms.includes(platform)) ||
    (projectTypes.length && !projectTypes.includes(projectType))
  ) {
    StepComponent = getManager(BlockType.INVALID_PLATFORM).step;
  }

  const step = (
    <StepComponent
      data={data as any}
      ports={node.ports as any}
      isLast={isLast}
      engine={engine}
      nluType={nlu}
      palette={palette}
      platform={platform}
      withPorts={stepAPI.withPorts}
      projectType={projectType}
    />
  );

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
            <Step.Placeholder palette={palette} isLast={isLast} />
            <Portal portalNode={engine.merge.components.mergeLayer?.ref.current}>{step}</Portal>
          </>
        ) : (
          step
        )}
      </StepAPIProvider>
    </>
  );
};

export default React.memo(NodeStep);
