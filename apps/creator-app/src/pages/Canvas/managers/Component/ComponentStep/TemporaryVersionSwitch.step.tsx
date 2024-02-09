import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useFeature } from '@/hooks';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import LegacyComponentStep from '../legacy/components/Step';
import ComponentStep from './Component.step';

export const TemporaryVersionSwitch: ConnectedStep<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = (props) => {
  const { isEnabled: isCMSComponentsEnabled } = useFeature(Realtime.FeatureFlag.CMS_COMPONENTS);

  if (isCMSComponentsEnabled) {
    return <ComponentStep {...props} />;
  }

  return <LegacyComponentStep {...props} />;
};
