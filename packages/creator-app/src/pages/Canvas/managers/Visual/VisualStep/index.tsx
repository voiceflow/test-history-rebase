import { Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ConnectedStep } from '@/pages/Canvas/components/Step';

import { APLStep, ImageStep } from './components';

const ConnectedVisualStep: ConnectedStep<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = ({ data, ...props }) => (
  <>
    {data.visualType === Node.Visual.VisualType.APL && <APLStep data={data} {...props} />}
    {data.visualType === Node.Visual.VisualType.IMAGE && <ImageStep data={data} {...props} />}
  </>
);

export default ConnectedVisualStep;
