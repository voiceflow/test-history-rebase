import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { HSLShades } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import { useDispatch, useTrackingEvents } from '@/hooks';
import { useResetPrototype } from '@/pages/Prototype/hooks';

import { PlayButtonContainer } from './styles';

interface PlayButtonProps {
  nodeID?: string;
  palette: HSLShades;
}

const PlayButton: React.FC<PlayButtonProps> = ({ nodeID, palette }) => {
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
    <PlayButtonContainer>
      <TippyTooltip title="Start test from here">
        <SvgIcon icon="play" clickable color={palette[700]} style={{ transform: 'scale(1.2)' }} onClick={startTestFromBlock} />
      </TippyTooltip>
    </PlayButtonContainer>
  );
};

export default PlayButton;
