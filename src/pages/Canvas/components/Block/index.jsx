import cuid from 'cuid';
import React from 'react';

import User from '@/components/User';
import { useImperativeApi } from '@/hooks';
import AddStepButton from '@/pages/Canvas/components/AddStepButton';
import MergeOverlay from '@/pages/Canvas/components/MergeOverlay';
import PortSet from '@/pages/Canvas/components/PortSet';
import { getBlockCategory } from '@/pages/Canvas/constants';
import { EditPermissionContext, EngineContext, ManagerContext, PlatformContext, useNode, useNodeData } from '@/pages/Canvas/contexts';
import { getNextSteps } from '@/pages/Canvas/utils';

import { Container, Overlay, Title } from './components';

function Block(_, ref) {
  const { node, isHighlighted, lockOwner } = useNode();
  const { data } = useNodeData();
  const { block: BlockContent, platforms } = React.useContext(ManagerContext)(data.type);
  const platform = React.useContext(PlatformContext);
  const { canEdit } = React.useContext(EditPermissionContext);
  const engine = React.useContext(EngineContext);
  const nodeRef = useImperativeApi({
    ref,
    deps: [node.id],
    creator: () => ({ rename: () => engine.focus.set(node.id, { renameActiveRevision: cuid() }) }),
  });

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
