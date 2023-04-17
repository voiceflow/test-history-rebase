import * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, Popper, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

import { ConnectedAction } from '../../types';
import { NODE_CONFIG } from '../constants';
import ActionPreview from './ActionPreview';
import { useGoToDomain } from './hooks';

const GoToDomainAction: ConnectedAction<Realtime.NodeData.GoToDomain> = ({ data, onRemove, reversed, isActive, onOpenEditor }) => {
  const goToDomainDiagram = useDispatch(Router.goToDomainDiagram);

  const goToDomain = useGoToDomain(data.domainID ?? null);

  const onOpenTarget = () => goToDomain && goToDomainDiagram(goToDomain.id, goToDomain.rootDiagramID);

  const isEmpty = !goToDomain;

  return (
    <Popper
      placement="top-start"
      renderContent={({ onClose }) => (
        <ActionPreview
          content={isEmpty ? 'Select domain' : `'${goToDomain.name}'`}
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
            <TippyTooltip tag="div" content="Domain is missing" disabled={!isEmpty || isActive} offset={[0, 2]}>
              <Canvas.Action.Icon icon={isEmpty && !isActive ? 'warning' : NODE_CONFIG.icon!} />
            </TippyTooltip>
          }
          label={<Canvas.Action.Label secondary={isEmpty}>{isEmpty ? 'Select domain' : data.name || goToDomain.name}</Canvas.Action.Label>}
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

export default GoToDomainAction;
