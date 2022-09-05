import * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, TippyTooltip } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { createPlatformSelector } from '@/utils/platform';

import { ConnectedAction } from '../../types';
import { NODE_CONFIG } from '../constants';

const getPlatformLabel = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Skill',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Google Action',
  },
  'Assistant'
);

const Action: ConnectedAction<Realtime.NodeData.Exit> = ({ data, reversed, platform, isActive }) => (
  <TippyTooltip tag="div" title={`${getPlatformLabel(platform)} ends in the active state.`} distance={4} position="top-start" bodyOverflow>
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
