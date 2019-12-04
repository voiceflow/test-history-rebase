import cuid from 'cuid';
import React from 'react';

import User from '@/components/User';
import AddStepButton from '@/containers/CanvasV2/components/AddStepButton';
import MergeOverlay from '@/containers/CanvasV2/components/MergeOverlay';
import PortSet from '@/containers/CanvasV2/components/PortSet';
import { getBlockCategory } from '@/containers/CanvasV2/constants';
import { EditPermissionContext, EngineContext, PlatformContext, useNode, useNodeData } from '@/containers/CanvasV2/contexts';
import { NODE_MANAGERS } from '@/containers/CanvasV2/managers';
import { getNextSteps } from '@/containers/CanvasV2/utils';
import { useImperativeApi } from '@/hooks';

import { Container, Overlay, Title } from './components';

function Block(_, ref) {
  const { node, isHighlighted, lockOwner } = useNode();
  const { data } = useNodeData();
  const platform = React.useContext(PlatformContext);
  const { canEdit } = React.useContext(EditPermissionContext);
  const engine = React.useContext(EngineContext);
  const nodeRef = useImperativeApi({
    ref,
    deps: [node.id],
    creator: () => ({ rename: () => engine.focus.set(node.id, { renameActiveRevision: cuid() }) }),
  });

  const { block: BlockContent, platforms } = NODE_MANAGERS[data.type];
  const { color } = getBlockCategory(data.type);
  const nextSteps = getNextSteps(data.type);
  const isEnabled = !platforms || platforms.includes(platform);
  const canAdd = !!nextSteps.length && canEdit;

  const onAddStep = (type) => engine.node.addNested(node.id, cuid(), type);

  return (
    <Container isEnabled={isEnabled} isActive={isHighlighted} color={color} ref={nodeRef}>
      {lockOwner && <User user={lockOwner} />}
      <Title>{data.name}</Title>
      <PortSet ports={node.ports}>{BlockContent && <BlockContent data={data} />}</PortSet>
      <MergeOverlay component={Overlay} />
      {canAdd && <AddStepButton options={nextSteps} onAdd={onAddStep} />}
    </Container>
  );
}

export default React.forwardRef(Block);
