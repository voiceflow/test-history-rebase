import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

export const ButtonsV2Step: ConnectedStep<Realtime.NodeData.ButtonsV2> = ({ data }) => {
  return (
    <Step nodeID={data.nodeID}>
      <Section>Placeholder</Section>
    </Step>
  );
};
