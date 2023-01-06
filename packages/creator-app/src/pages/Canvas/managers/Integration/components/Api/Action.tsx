import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, Popper, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Step from '@/pages/Canvas/components/Step';
import { ConnectedAction } from '@/pages/Canvas/managers/types';
import { getCustomAPIActionLabel } from '@/utils/customApi';

import { NODE_CONFIG } from '../../constants';
import ActionPreview from './ActionPreview';

const Action: ConnectedAction<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts> = ({
  data,
  ports,
  onRemove,
  reversed,
  isActive,
  onOpenEditor,
}) => {
  const { url, selectedAction } = data;

  const isEmpty = !url;

  return (
    <Popper
      placement="top-start"
      renderContent={({ onClose }) => (
        <ActionPreview
          title={`${getCustomAPIActionLabel(selectedAction)} request`}
          content={url || 'Add URL'}
          onClose={onClose}
          onRemove={onRemove}
          onOpenEditor={onOpenEditor}
        />
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Canvas.Action
          ref={ref}
          icon={
            <TippyTooltip tag="div" content="API request URL missing" disabled={!isEmpty || isActive} offset={[0, 2]}>
              <Canvas.Action.Icon icon={isEmpty && !isActive ? 'warning' : NODE_CONFIG.getIcon!(data)} />
            </TippyTooltip>
          }
          port={<Step.ActionPort portID={ports.out.builtIn[BaseModels.PortType.NEXT]} />}
          label={
            <Canvas.Action.Label secondary={isEmpty}>
              {isEmpty ? 'Add request' : data.name || `${getCustomAPIActionLabel(selectedAction)} request`}
            </Canvas.Action.Label>
          }
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
