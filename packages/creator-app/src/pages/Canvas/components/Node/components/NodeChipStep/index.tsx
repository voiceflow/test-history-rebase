import React from 'react';

import { HSLShades } from '@/constants';
import { useActiveProjectConfig } from '@/hooks';
import { ChipAPIProvider } from '@/pages/Canvas/components/Chip';
import { EngineContext, ManagerContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { CombinedAPI } from '@/pages/Canvas/types';

import NodeLifecycle from '../NodeLifecycle';
import { useNodeInstance } from '../NodeStep/hooks';
import Styles from '../NodeStepStyles';
import { useChipApi, useChipStepAPI } from './hooks';

export interface NodeStepProps {
  name: string;
  palette: HSLShades;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onRename: (name: string) => void;
  isHovered: boolean;
  isDisabled?: boolean;
  onMouseMove?: React.MouseEventHandler<HTMLElement>;
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  hasLinkWarning: boolean;
}

const NodeChipStep = React.forwardRef<CombinedAPI, React.PropsWithChildren<NodeStepProps>>(({ isHovered, hasLinkWarning, ...props }, ref) => {
  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { nlu, platform, projectType } = useActiveProjectConfig();

  const instance = useNodeInstance();

  const chipApi = useChipApi(instance.ref);
  const chipStepApi = useChipStepAPI({ ref: instance.ref, apiRef: chipApi.apiRef, nodeID: nodeEntity.nodeID, ...props });

  const { node, data, isDragging } = nodeEntity.useState((e) => {
    const resolved = e.resolve();

    return {
      node: resolved.node,
      data: resolved.data,
      isDragging: e.isDragging,
    };
  });

  nodeEntity.useInstance(instance);

  React.useEffect(() => {
    engine.node.redrawNestedLinks(node.parentNode);
  }, [data]);

  React.useEffect(() => {
    if (!isDragging) {
      engine.node.redrawLinks(nodeEntity.nodeID);
    }
  }, [isDragging]);

  React.useImperativeHandle(ref, () => chipApi, []);

  const { chip: Chip } = getManager(nodeEntity.nodeType);

  if (!Chip) return null;

  return (
    <>
      <Styles isHovered={isHovered} hasLinkWarning={hasLinkWarning} />
      <NodeLifecycle />

      <ChipAPIProvider value={chipStepApi}>
        <Chip data={data as any} ports={node.ports as any} engine={engine} nluType={nlu} platform={platform} projectType={projectType} />
      </ChipAPIProvider>
    </>
  );
});

export default NodeChipStep;
