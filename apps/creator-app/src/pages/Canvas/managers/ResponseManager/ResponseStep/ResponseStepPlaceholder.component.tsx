import React from 'react';

import type { HSLShades } from '@/constants';
import Step from '@/pages/Canvas/components/Step';

export interface IResponseStepPlaceholderProps {
  nextPortID?: string;
  palette: HSLShades;
  nodeID: string;
}

export const ResponseStepPlaceholder = ({ nextPortID, palette, nodeID }: IResponseStepPlaceholderProps) => (
  <Step nodeID={nodeID} dividerOffset={22}>
    <Step.Section v2>
      <Step.Item placeholder="Enter agent says" portID={nextPortID} palette={palette} v2 />
    </Step.Section>
  </Step>
);
