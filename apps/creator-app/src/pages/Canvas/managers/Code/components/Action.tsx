import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, Popper, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Step from '../../../components/Step';
import { ConnectedAction } from '../../types';
import { NODE_CONFIG } from '../constants';
import ActionPreview from './ActionPreview';

const Action: ConnectedAction<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = ({
  data,
  ports,
  onRemove,
  reversed,
  isActive,
  onOpenEditor,
}) => {
  const isEmpty = !data.code;

  return (
    <Popper
      placement="top-start"
      modifiers={{ preventOverflow: { padding: { top: 72, bottom: 16, left: 16, right: 16 } } }}
      renderContent={({ onClose }) => <ActionPreview content={data.code} onClose={onClose} onRemove={onRemove} onOpenEditor={onOpenEditor} />}
    >
      {({ ref, onToggle, isOpened }) => (
        <Canvas.Action
          ref={ref}
          icon={
            <TippyTooltip tag="div" content="Code is missing" disabled={!isEmpty || isActive} offset={[0, 2]}>
              <Canvas.Action.Icon icon={isEmpty && !isActive ? 'warning' : NODE_CONFIG.icon!} />
            </TippyTooltip>
          }
          port={<Step.ActionPort portID={ports.out.builtIn[BaseModels.PortType.NEXT]} />}
          label={<Canvas.Action.Label secondary={isEmpty}>{isEmpty ? 'Add code' : data.name || 'Javascript'}</Canvas.Action.Label>}
          nodeID={data.nodeID}
          active={isOpened || isActive}
          onClick={swallowEvent(onToggle)}
          reversed={reversed}
        />
      )}
    </Popper>
  );
};

export default Action;
