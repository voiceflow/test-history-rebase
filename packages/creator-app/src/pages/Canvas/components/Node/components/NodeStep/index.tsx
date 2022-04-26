import { Portal } from '@voiceflow/ui';
import React from 'react';

import { BlockType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import * as Step from '@/pages/Canvas/components/Step';
import { StepAPIProvider } from '@/pages/Canvas/components/Step/contexts';
import { EngineContext, ManagerContext, NodeEntityContext, PortEntityProvider } from '@/pages/Canvas/contexts';
import { PlatformContext, ProjectTypeContext } from '@/pages/Project/contexts';

import NodeLifecycle from '../NodeLifecycle';
import NodePort from '../NodePort';
import { useNodeInstance, useStepAPI } from './hooks';
import Styles from './NodeStepStyles';

export interface NodeStepProps {
  isLast: boolean;
  variant: BlockVariant;
  isDraggable: boolean;
}

const NodeStep: React.FC<NodeStepProps> = ({ isLast, variant, isDraggable }) => {
  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext)!;
  const projectType = React.useContext(ProjectTypeContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const instance = useNodeInstance();
  const { node, data, isDragging } = nodeEntity.useState((e) => {
    const resolved = e.resolve();

    return {
      node: resolved.node,
      data: resolved.data,
      isDragging: e.isDragging,
    };
  });

  const getAnchorPoint = React.useCallback(() => {
    const rect = instance.ref.current?.getBoundingClientRect();

    if (!rect || !engine.canvas) return null;

    return rect;
  }, []);

  const stepAPI = useStepAPI(instance.ref, isLast, isDraggable, getAnchorPoint);

  nodeEntity.useInstance(instance);

  React.useEffect(() => {
    engine.node.redrawNestedLinks(node.parentNode!);
  }, [data]);

  React.useEffect(() => {
    if (!isDragging) {
      engine.node.redrawLinks(nodeEntity.nodeID);
    }
  }, [isDragging]);

  const { platforms = [], projectTypes = [], ...manager } = getManager(nodeEntity.nodeType);
  let StepComponent = manager.step || getManager(BlockType.DEPRECATED).step;

  if ((platforms.length && !platforms.includes(platform)) || (projectTypes.length && !projectTypes.includes(projectType))) {
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
              <StepComponent
                ports={node.ports}
                data={data}
                engine={engine}
                platform={platform}
                projectType={projectType}
                withPorts={stepAPI.withPorts}
                variant={variant}
              />
            </Portal>
          </>
        ) : (
          <StepComponent
            ports={node.ports}
            data={data}
            engine={engine}
            platform={platform}
            projectType={projectType}
            withPorts={stepAPI.withPorts}
            variant={variant}
          />
        )}
      </StepAPIProvider>
    </>
  );
};

export default React.memo(NodeStep);
