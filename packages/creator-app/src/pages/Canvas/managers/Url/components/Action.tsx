import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, Popper, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { copyWithToast } from '@/utils/clipboard';
import { transformVariablesToReadable } from '@/utils/slot';

import Step from '../../../components/Step';
import { ConnectedAction } from '../../types';
import { NODE_CONFIG } from '../constants';
import ActionPreview from './ActionPreview';

const Action: ConnectedAction<Realtime.NodeData.Url, Realtime.NodeData.UrlBuiltInPorts> = ({
  data,
  ports,
  onRemove,
  reversed,
  isActive,
  onOpenEditor,
}) => {
  const isEmpty = !data.url;

  return (
    <Popper
      placement="top-start"
      borderRadius="8px"
      renderContent={({ onClose }) => (
        <ActionPreview
          content={isEmpty ? 'Enter URL' : data.url}
          onClose={onClose}
          onRemove={onRemove}
          onOpenEditor={onOpenEditor}
          onCopyContent={isEmpty ? null : copyWithToast(data.url)}
        />
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Canvas.Action
          ref={ref}
          icon={
            <TippyTooltip tag="div" title="URL is missing" disabled={!isEmpty || isActive} distance={2} bodyOverflow>
              <Canvas.Action.Icon icon={isEmpty && !isActive ? 'warning' : NODE_CONFIG.icon!} />
            </TippyTooltip>
          }
          port={<Step.ActionPort portID={ports.out.builtIn[BaseModels.PortType.NEXT]} />}
          label={
            <Canvas.Action.Label secondary={isEmpty}>{isEmpty ? 'Add URL' : data.name || transformVariablesToReadable(data.url)}</Canvas.Action.Label>
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
