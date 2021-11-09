import { Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ConnectedStepProps } from '@/pages/Canvas/components/Step';

import { APLStep, ImageStep } from './components';

export interface ImageStepProps {
  image: string | null;
  label: string | null;
  portID?: string;
  aspectRatio: number | null;
}

const ConnectedImageStep: React.FC<ConnectedStepProps<Realtime.NodeData.Visual>> = ({ data, ...props }) => (
  <>
    {data.visualType === Node.Visual.VisualType.APL && <APLStep data={data} {...props} />}
    {data.visualType === Node.Visual.VisualType.IMAGE && <ImageStep data={data} {...props} />}
  </>
);

export default ConnectedImageStep;
