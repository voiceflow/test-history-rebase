import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { createPlatformSelector } from '@/utils/platform';

import { ConnectedAction } from '../../types';
import { NODE_CONFIG } from '../constants';

const getPlatformLabel = createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: 'Skill',
    [Platform.Constants.PlatformType.GOOGLE]: 'Google Action',
  },
  'Agent'
);

const Action: ConnectedAction<Realtime.NodeData.Exit> = ({ data, reversed, platform, isActive }) => (
  <TippyTooltip tag="div" content={`${getPlatformLabel(platform)} ends in the active state.`} offset={[0, 4]} position="top-start">
    <Canvas.Action
      icon={<Canvas.Action.Icon icon={NODE_CONFIG.icon!} />}
      label={<Canvas.Action.Label>{data.name || 'End'}</Canvas.Action.Label>}
      nodeID={data.nodeID}
      active={isActive}
      reversed={reversed}
    />
  </TippyTooltip>
);

export default Action;
