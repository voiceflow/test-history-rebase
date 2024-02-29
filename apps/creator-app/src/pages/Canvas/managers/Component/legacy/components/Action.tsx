import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, Popper, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { FlowMapByDiagramIDContext } from '@/pages/Canvas/contexts';

import Step from '../../../../components/Step';
import { ConnectedAction } from '../../../types';
import { NODE_CONFIG } from '../../ComponentManager.constants';
import ActionPreview from './ActionPreview';

const Action: ConnectedAction<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = ({
  data,
  ports,
  onRemove,
  reversed,
  isActive,
  onOpenEditor,
  sourceNodeID,
}) => {
  const flowMapByDiagramID = React.useContext(FlowMapByDiagramIDContext)!;
  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

  const diagram = data.diagramID ? flowMapByDiagramID[data.diagramID] : null;
  const isEmpty = !diagram;

  return (
    <Popper
      placement="top-start"
      renderContent={({ onClose }) => (
        <ActionPreview
          content={isEmpty ? 'Select component' : `'${diagram.name}'`}
          onClose={onClose}
          onRemove={onRemove}
          onOpenEditor={onOpenEditor}
          onOpenTarget={isEmpty ? null : () => goToDiagram(diagram.id, undefined, sourceNodeID)}
        />
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Canvas.Action
          ref={ref}
          icon={
            <TippyTooltip tag="div" content="Component is missing" disabled={!isEmpty || isActive} offset={[0, 2]}>
              <Canvas.Action.Icon icon={isEmpty && !isActive ? 'warning' : NODE_CONFIG.icon!} />
            </TippyTooltip>
          }
          port={<Step.ActionPort portID={ports.out.builtIn[BaseModels.PortType.NEXT]} />}
          label={<Canvas.Action.Label secondary={isEmpty}>{isEmpty ? 'Select component' : data.name || diagram.name}</Canvas.Action.Label>}
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
