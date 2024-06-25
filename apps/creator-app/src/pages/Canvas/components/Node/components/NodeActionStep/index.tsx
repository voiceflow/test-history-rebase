import type { Struct } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as Tracking from '@/ducks/tracking';
import { useActiveProjectConfig } from '@/hooks';
import { StepAPIProvider } from '@/pages/Canvas/components/Step/contexts';
import { EngineContext, ManagerContext, NodeEntityContext } from '@/pages/Canvas/contexts';

import NodeLifecycle from '../NodeLifecycle';
import { useActionStepAPI, useNodeInstance } from './hooks';

export interface NodeActionStepProps {
  isLast: boolean;
  reversed: boolean;
  isActive: boolean;
  sourcePortID: string;
  sourceNodeID: string;
  onOpenEditor: (actionNodeID: string, routeState?: Struct) => void;
}

const NodeActionStep: React.FC<NodeActionStepProps> = ({
  isLast,
  reversed,
  isActive,
  sourcePortID,
  sourceNodeID,
  onOpenEditor,
}) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const { nlu, platform, projectType } = useActiveProjectConfig();

  const instance = useNodeInstance();

  const { node, data } = nodeEntity.useState((e) => {
    const { node, data } = e.resolve();

    return { node, data };
  });

  const stepAPI = useActionStepAPI(instance.ref, isLast);

  const onRemove = async () => {
    const sourceNode = engine.select(CreatorV2.nodeByPortIDSelector, { id: sourcePortID });

    await engine.node.remove(node.id);

    if (sourceNode) {
      engine.store.dispatch(Tracking.trackActionDeleted({ nodeType: sourceNode.type, actionType: node.type }));
    }
  };

  nodeEntity.useInstance(instance);

  React.useEffect(() => {
    engine.node.redrawNestedLinks(node.parentNode);
  }, [data]);

  const { action: ActionComponent } = getManager(nodeEntity.nodeType as Realtime.StepBlockType);

  if (!ActionComponent) return null;

  return (
    <>
      <NodeLifecycle />

      <StepAPIProvider value={stepAPI}>
        <div ref={instance.ref as React.RefObject<HTMLDivElement>}>
          <ActionComponent
            data={data as any}
            ports={node.ports as any}
            engine={engine}
            nluType={nlu}
            reversed={reversed}
            platform={platform}
            isActive={isActive}
            onRemove={onRemove}
            withPorts={stepAPI.withPorts}
            projectType={projectType}
            sourcePortID={sourcePortID}
            sourceNodeID={sourceNodeID}
            onOpenEditor={(routeState) => onOpenEditor(node.id, routeState)}
          />
        </div>
      </StepAPIProvider>
    </>
  );
};

export default React.memo(NodeActionStep);
