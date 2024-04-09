import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, Popper, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { ActiveDiagramNormalizedEntitiesAndVariablesContext } from '@/pages/Canvas/contexts';
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
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

  const url = data.url && transformVariablesToReadable(data.url, entitiesAndVariables.byKey);

  return (
    <Popper
      placement="top-start"
      modifiers={{ preventOverflow: { padding: { top: 72, bottom: 16, left: 16, right: 16 } } }}
      renderContent={({ onClose }) => (
        <ActionPreview
          content={url || 'Enter URL'}
          onClose={onClose}
          onRemove={onRemove}
          onOpenEditor={onOpenEditor}
          onCopyContent={url ? copyWithToast(url) : null}
        />
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Canvas.Action
          ref={ref}
          icon={
            <TippyTooltip tag="div" content="URL is missing" disabled={!!url || isActive} offset={[0, 2]}>
              <Canvas.Action.Icon icon={!url && !isActive ? 'warning' : NODE_CONFIG.icon!} />
            </TippyTooltip>
          }
          port={<Step.ActionPort portID={ports.out.builtIn[BaseModels.PortType.NEXT]} />}
          label={<Canvas.Action.Label secondary={!url}>{url ? data.name || url : 'Add URL'}</Canvas.Action.Label>}
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
