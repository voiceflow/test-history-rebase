import type * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, Popper, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import type { ConnectedAction } from '../../types';
import { NODE_CONFIG } from '../constants';
import ActionPreview from './ActionPreview';
import { useGoToIntentMeta } from './hooks';

const Action: ConnectedAction<Realtime.NodeData.GoToIntent> = ({
  data,
  engine,
  reversed,
  isActive,
  onRemove,
  onOpenEditor,
}) => {
  const { goToIntent, goToNodeID, goToIntentName } = useGoToIntentMeta(data.intent ?? null, data.diagramID);
  const isEmpty = !goToIntent || !goToNodeID;

  const onOpenTarget = () => !isEmpty && engine.focusDiagramNode(data.diagramID ?? null, goToNodeID);

  return (
    <Popper
      placement="top-start"
      modifiers={{ preventOverflow: { padding: { top: 72, bottom: 16, left: 16, right: 16 } } }}
      renderContent={({ onClose }) => (
        <ActionPreview
          onClose={onClose}
          content={isEmpty ? 'Select intent' : `'${goToIntentName}'`}
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
            <TippyTooltip tag="div" content="Intent is missing" disabled={!isEmpty || isActive} offset={[0, 2]}>
              <Canvas.Action.Icon icon={isEmpty && !isActive ? 'warning' : NODE_CONFIG.icon!} />
            </TippyTooltip>
          }
          label={
            <Canvas.Action.Label secondary={isEmpty}>
              {isEmpty ? 'Select intent' : data.name || goToIntentName}
            </Canvas.Action.Label>
          }
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

export default Action;
