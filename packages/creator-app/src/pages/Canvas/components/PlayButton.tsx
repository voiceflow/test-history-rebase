import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Prototype from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import { useDispatch, useTrackingEvents } from '@/hooks';
import { useResetPrototype } from '@/pages/Prototype/hooks';

interface PlayButtonProps {
  color: string;
  nodeID?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ nodeID, color }) => {
  const resetPrototype = useResetPrototype();
  const updatePrototype = useDispatch(Prototype.updatePrototype);
  const goToCurrentPrototype = useDispatch(Router.goToCurrentPrototype);
  const [trackingEvents] = useTrackingEvents();

  const startTestFromBlock = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();

    resetPrototype();
    updatePrototype({ autoplay: true });
    goToCurrentPrototype(nodeID);

    trackingEvents.trackProjectBlockPrototypeTestStart();
  };

  return (
    <TippyTooltip title="Start test from here">
      <SvgIcon icon="play" clickable color={color} style={{ transform: 'scale(1.2)' }} onClick={startTestFromBlock} />
    </TippyTooltip>
  );
};

export default PlayButton;
