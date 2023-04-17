import * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, Popper, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { ConnectedAction } from '../../types';
import { NODE_CONFIG } from '../constants';
import ActionPreview from './ActionPreview';
import { useGoToNode } from './hooks';

const GoToNodeAction: ConnectedAction<Realtime.NodeData.GoToNode> = ({ data, engine, onRemove, reversed, isActive, onOpenEditor }) => {
  const goToNode = useGoToNode(data.goToNodeID ?? null, data.diagramID);
  const isEmpty = !goToNode?.name;

  const onOpenTarget = () => goToNode && engine.focusDiagramNode(data.diagramID ?? null, goToNode.nodeID);

  return (
    <Popper
      placement="top-start"
      renderContent={({ onClose }) => (
        <ActionPreview
          content={isEmpty ? 'Select block' : `'${goToNode.name}'`}
          onClose={onClose}
          onRemove={onRemove}
          onOpenEditor={onOpenEditor}
          onOpenTarget={isEmpty ? null : onOpenTarget}
        />
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Canvas.Action
          ref={ref}
          icon={
            <TippyTooltip tag="div" content="Block is missing" disabled={!isEmpty || isActive} offset={[0, 2]}>
              <Canvas.Action.Icon icon={isEmpty && !isActive ? 'warning' : NODE_CONFIG.icon!} />
            </TippyTooltip>
          }
          label={<Canvas.Action.Label secondary={isEmpty}>{isEmpty ? 'Select block' : data.name || goToNode.name}</Canvas.Action.Label>}
          nodeID={data.nodeID}
          active={isOpened || isActive}
          onClick={swallowEvent(onToggle)}
          reversed={reversed}
          onDoubleClick={swallowEvent(onOpenTarget)}
        />
      )}
    </Popper>
  );
};

export default GoToNodeAction;
