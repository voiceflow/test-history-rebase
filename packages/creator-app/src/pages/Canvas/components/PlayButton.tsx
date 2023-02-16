import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Prototype from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useTrackingEvents } from '@/hooks';

interface PlayButtonProps {
  color: string;
  nodeID?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ nodeID, color }) => {
  const updatePrototype = useDispatch(Prototype.updatePrototype);
  const goToCurrentPrototype = useDispatch(Router.goToCurrentPrototype);
  const currentDiagramVariableState = useDispatch(VariableState.currentDiagramVariableState);
  const [trackingEvents] = useTrackingEvents();

  const startTestFromBlock = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();

    updatePrototype({ autoplay: true });
    currentDiagramVariableState(nodeID!);
    goToCurrentPrototype();

    trackingEvents.trackProjectBlockPrototypeTestStart();
  };

  return (
    <TippyTooltip content="Start test from here">
      <SvgIcon icon="play" clickable color={color} style={{ transform: 'scale(1.2)' }} onClick={startTestFromBlock} />
    </TippyTooltip>
  );
};

export default PlayButton;
